/**
 * @file Control
 * @author zhujl
 */
define(function (require) {

    'use strict';

    /**
     * 控件基类关注以下逻辑：
     *
     * 1. 实现控件通用接口
     * 2. 实现生命周期管理
     * 3. 属性变化时的重绘
     */

    var Observable = require('./Observable');
    var lib = require('../lib/lib');
    var gui = require('../main');

    /**
     * 基类构造函数
     *
     * @constructor
     * @param {Object} options 初始化参数
     * @param {(HTMLElement | jQuery)=} options.main 控件主元素
     * @param {boolean=} options.disabled 是否禁用
     * @param {boolean=} options.hidden 是否隐藏
     */
    function Control(options) {

        options = $.extend({ }, options);

        Observable.call(this, options);

        this.main.data('guid', this.guid);

        /**
         * 当前生命周期阶段
         *
         * @type {number}
         */
        this.stage = lib.LifeCycle.NEW;

        /**
         * 创建时触发
         *
         * @event Control#new
         */
        this.trigger('new');


        /**
         * 数据和视图未同步的部分
         *
         * @type {Array}
         */
        this.changes = [ ];

        this.initOptions(options);

        this.stage = lib.LifeCycle.INITED;

        /**
         * 创建完成时触发
         *
         * @event Control#inited
         */
        this.trigger('inited');
    }

    Control.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'Control',

        /**
         * 初始化参数
         *
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, Control.defaultOptions);
            this.setProperties(options, true);
        },

        /**
         * 初始化 DOM 结构
         *
         * @protected
         */
        initStructure: function () {
            var type = this.type && this.type.toLowerCase();
            if (type) {
                var main = this.main;
                var uiClass = classPrefix + type;
                if (!main.hasClass(uiClass)) {
                    main.addClass(uiClass);
                }
            }
        },

        /**
         * 批量设置控件属性
         *
         * @param {Object} properties
         */
        setProperties: function (properties) {

            var changes = this.changes;
            var lastSize = changes.length;

            var keys = [ ];
            var key;

            // 按照 painter 定义执行顺序遍历
            var painter = this.constructor.painter;
            for (key in painter) {
                if (properties[key] !== undefined) {
                    keys.push(key);
                }
            }
            for (key in properties) {
                if (!painter[key]) {
                    keys.push(key);
                }
            }

            for (var i = 0, len = keys.length; i < len; i++) {
                key = keys[i];
                var newValue = properties[key];
                var oldValue = this[key];

                if (newValue !== oldValue) {

                    changes.push({
                        name: key,
                        newValue: newValue,
                        oldValue: oldValue
                    });

                    this[key] = newValue;
                }
            };

            if (lastSize !== changes.length) {
                this.stage = lib.LifeCycle.CHANGED;
                this.trigger('change');
            }

            // 自动同步
            if (arguments[1] !== true) {
                this.repaint();
            }
        },

        /**
         * 渲染控件
         */
        render: function () {

            var isInited = this.stage === lib.LifeCycle.INITED;

            if (isInited) {

                /**
                 * @event Control#beforerender
                 */
                this.trigger('beforerender');

                this.initStructure();
            }

            this.repaint();

            if (isInited) {

                /**
                 * @event Control#afterrender
                 */
                this.trigger('afterrender');
            }

            this.stage = lib.LifeCycle.RENDERED;
        },

        /**
         * 重绘控件
         * 属性变化需要更新到视图
         */
        repaint: function () {

            var changes = this.changes;
            var len = changes.length;

            if (len > 0) {

                var painter = this.constructor.painter;

                for (var i = 0; i < len; i++) {
                    var item = changes[i];
                    var paint = painter[item.name];

                    if (typeof paint === 'function') {
                        // 如果不满足 paint 时机, 会返回 false
                        // 并把 item 扔到 changes 最后
                        if (paint(this, item.newValue, item.oldValue) === false) {
                            changes.splice(i, 1);
                            changes.push(item);
                            i--;
                        }
                    }

                    //this[item.name] = item.newValue;
                }

                changes.length = 0;

                this.stage = lib.LifeCycle.RENDERED;
                this.trigger('render');
            }

        },

        /**
         * 将控件插到 target 内部最前面
         *
         * @param {(HTMLElement | jQuery)} target 目标容器元素
         */
        prependTo: function (target) {
            this.main.prependTo(target);
        },

        /**
         * 将控件插到 target 内部最后面
         *
         * @param {(HTMLElement | jQuery)} target 目标容器元素
         */
        appendTo: function (target) {
            this.main.appendTo(target);
        },

        /**
         * 设置控件状态为启用
         */
        enable: function () {
            this.setProperties({
                disabled: false
            });
        },

        /**
         * 禁用控件
         */
        disable: function () {
            this.setProperties({
                disabled: true
            });
        },

        /**
         * 判断控件是否禁用
         *
         * @return {boolean}
         */
        isDisabled: function () {
            return this.disabled;
        },

        /**
         * 显示控件
         */
        show: function () {
            if (this.isHidden()) {

                /**
                 * @event Control#beforeshow
                 */
                this.trigger('beforeshow');

                this.setProperties({
                    hidden: false
                });

                /**
                 * @event Control#aftershow
                 */
                this.trigger('aftershow');
            }
        },

        /**
         * 隐藏控件
         */
        hide: function () {
            if (!this.isHidden()) {

                /**
                 * @event Control#beforehide
                 */
                this.trigger('beforehide');

                this.setProperties({
                    hidden: true
                });

                /**
                 * @event Control#afterhide
                 */
                this.trigger('afterhide');
            }
        },

        /**
         * 判断控件是否隐藏
         *
         * @return {boolean}
         */
        isHidden: function () {
            return this.hidden;
        },

        /**
         * 切换控件可见状态
         */
        toggle: function () {
            this[ this.isHidden() ? 'show' : 'hide' ]();
        },

        /**
         * 获得控件宽度
         *
         * @return {number}
         */
        getWidth: function () {
            return this.width;
        },

        /**
         * 设置控件宽度
         *
         * @param {number} width
         */
        setWidth: function () {
            this.setProperties({
                width: width
            });
        },

        /**
         * 获得控件高度
         *
         * @return {number}
         */
        getHeight: function () {
            return this.height;
        },

        /**
         * 设置控件高度
         *
         * @param {number} width
         */
        setHeight: function () {
            this.setProperties({
                height: height
            });
        },

        /**
         * 销毁控件
         */
        dispose: function () {

            this.trigger('beforedispose');

            Observable.prototype.dispose.call(this);

            this.stage = lib.LifeCycle.DISPOSED;
        }

    };

    Control.defaultOptions = {
        hidden: false,
        disabled: false
    };

    /**
     * 控件的画笔，用来设置如何绘制控件
     *
     * @static
     * @type {Object}
     */
    Control.painter = {

        width: function (ctrl, width) {
            if (width != null) {
                ctrl.main.width(width);
            }
        },

        height: function (ctrl, height) {
            if (height != null) {
                ctrl.main.height(height);
            }
        },

        disabled: function (ctrl, disabled) {
            var main = ctrl.main;
            if (disabled) {
                main.attr('disabled', 'disabled');
            }
            else {
                main.removeAttr('disabled');
            }
        },

        hidden: function (ctrl, hidden) {
            var main = ctrl.main;
            if (hidden) {
                main.attr('hidden', 'hidden');
            }
            else {
                main.removeAttr('hidden');
            }
        }
    };

    var classPrefix = gui.config.uiClassPrefix + '-';

    lib.inherits(Control, Observable);


    return Control;

});
