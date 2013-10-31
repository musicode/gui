/**
 * @file Overlay
 * @author zhujl
 */
define(function (require) {

    var SuperClass = require('./Control');
    var position = require('../helper/position');
    var lib = require('../helper/lib');

    /**
     * 浮层基类
     *
     * 浮层一般有两种使用场景:
     * 1. 类似 ComboBox 的下拉控件, 浮层和触发元素位于同一个容器中, 可用 css
     * 解决定位问题, 不存在 resize 即时调整的需求
     *
     * 2. 类似 Dialog, 浮层位于 body 第一级, 需要动态算位置, 也需要响应 resize,
     * 所以需要一个抽象的定位规则
     *
     * @constructor
     * @param {Object} options
     * @param {(HTMLElement | jQuery)=} options.main 主元素
     * @param {string=} options.template 浮层模板
     * @param {number=} options.width 宽度
     * @param {number=} options.height 高度
     * @param {boolean=} options.global 是否是全局的浮层(即 body 第一级子元素)
     * @param {Object} options.align 对齐方式
     * @param {Object} options.align.base 基准对象
     * @param {HTMLElement} options.align.baseElement 基准元素
     * @param {Object} options.align.base 基准对象
     * @param {string} options.align.base.x 基准对齐点 x 坐标
     * @param {string} options.align.base.y 基准对齐点 y 坐标
     * @param {Object} options.align.self 浮层自身
     * @param {string} options.align.self.x 浮层对齐点 x 坐标
     * @param {string} options.align.self.y 浮层对齐点 y 坐标
     */
    function Overlay(options) {
        SuperClass.apply(this, arguments);
    }

    Overlay.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'Overlay',

        /**
         * 初始化控件配置
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, Overlay.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化 DOM 结构和事件
         *
         * @protected
         * @override
         */
        initStructure: function () {
            var main = this.main;

            if (typeof this.template === 'string') {
                main.html(this.template);
            }

            this.on('aftershow', afterShow);
            this.on('afterhide', afterHide);

            SuperClass.prototype.initStructure.apply(this, arguments);
        },

        /**
         * 创建主元素
         *
         * @protected
         * @override
         * @param {Object} options
         * @return {HTMLElement}
         */
        createMain: function (options) {
            return document.createElement('div');
        }
    };

    /**
     * 默认配置
     *
     * @type {Object}
     */
    Overlay.defaultOptions = {
        global: false,
        hidden: true
    };

    Overlay.painter = {

        global: function (overlay, global) {
            if (global) {
                var main = overlay.main[0];
                var parentNode = main.parentNode;
                if (!parentNode || parentNode.tagName !== 'BODY') {
                    document.body.appendChild(main);
                }
            }
        },

        align: function (overlay, align) {
            // 必须先加入文档树
            // 不然计算盒模型会有问题
            if (!lib.contains(document.body, overlay.main[0])) {
                return false;
            }

            if (align) {
                setAlign(overlay);
            }
        }
    };

    function afterShow() {
        if (this.global) {
            autoAlign(this);
        }
    }

    function afterHide() {
        var onresize = this._onresize;
        if (typeof onresize === 'function') {
            var win = lib.getWindow();
            win.off('resize', onresize);
            delete this._onresize;
        }
    }

    /**
     * 自动对齐
     *
     * 在浏览器 resize 过程中即时调整浮层位置
     *
     * @param {Overlay} overlay
     */
    function autoAlign(overlay) {

        function onresize() {
            setAlign(overlay);
        }
        overlay._onresize = onresize;

        var win = lib.getWindow();
        win.resize(onresize);
    }

    /**
     * 根据浮层 align 配置进行位置调整
     *
     * @param {Overlay} overlay
     */
    function setAlign(overlay) {

        var align = overlay.align;

        var pin = {
            element: overlay.main,
            x: align.self.x,
            y: align.self.y
        };

        var base = {
            element: align.baseElement,
            x: align.base.x,
            y: align.base.y
        };

        position.pin(pin, base);
    }

    lib.inherits(Overlay, SuperClass);


    return Overlay;

});
