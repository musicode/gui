/**
 * @file AutoComplete
 * @author zhujl
 */
define(function (require) {

    'use strict';
    
    var SuperClass = require('./interface/Control');

    var TextBox = require('./TextBox');
    var List = require('./List');

    var iterator = require('./lib/iterator');
    var lib = require('./lib/lib');

    /**
     * 自动补全
     *
     * @constructor
     * @param {Object} options
     * @param {string=} options.value
     * @param {string=} options.placeholder
     * @param {number=} options.width 输入框的宽度
     * @param {Function} options.remote 远程数据, 一般用作补全提示
     * @param {Function} options.local 本地数据, 一般用作数据筛选
     */
    function AutoComplete(options) {
        SuperClass.apply(this, arguments);
    }

    AutoComplete.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'AutoComplete',

        /**
         * 初始化控件参数
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, AutoComplete.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化控件 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            var main = this.main;

            // 创建文本输入框
            var textBox = new TextBox();
            textBox.appendTo(main);
            textBox.render();
            this.textBox = textBox;

            // 创建下拉列表
            var list = new List({
                toggle: false
            });
            list.appendTo(main);
            list.render();
            this.list = list;

            // 实现按上下键遍历元素
            this.iteratorConfig = createIteratorConfig(this);

            // 绑事件
            textBox.on('keydown', onkeydown, this);
            textBox.on('keyup', onkeyup, this);
            textBox.on('focus', onfocus, this);
            textBox.on('blur', onblur, this);
            textBox.on('input', oninput, this);
            textBox.on('submit', onsubmit, this);

            // 列表事件
            list.on('clickitem', clickItem, this);
            list.on('enteritem', enterItem, this);
            list.on('leaveitem', leaveItem, this);
            list.on('clickgroup', clickGroup, this);
            list.on('entergroup', enterGroup, this);
            list.on('leavegroup', leaveGroup, this);

            this.one('beforedispose', beforeDispose);

            SuperClass.prototype.initStructure.apply(this, arguments);
        },

        /**
         * 打开提示层
         */
        open: function () {
            this.setProperties({
                closed: false
            });
        },

        /**
         * 关闭提示层
         */
        close: function () {
            this.setProperties({
                closed: true
            });
        },

        /**
         * 提交表单
         */
        submit: function () {
            this.fire('ui-submit', {
                data: this.getValue()
            });
        },

        /**
         * 获取当前 value
         *
         * @return {string}
         */
        getValue: function () {
            return this.textBox.getValue();
        },

        /**
         * 设置 value
         *
         * @param {string} value
         */
        setValue: function (value) {
            this.textBox.setProperties({
                value: value
            });
        },

        /**
         * 获取当前 placeholder
         *
         * @return {string}
         */
        getPlaceholder: function () {
            return this.textBox.getPlaceholder();
        },

        /**
         * 设置 placeholder
         *
         * @param {string} placeholder
         */
        setPlaceholder: function (placeholder) {
            this.textBox.setProperties({
                placeholder: placeholder
            });
        },

        /**
         * 获得补全数据
         *
         * @return {Array}
         */
        getDatasouce: function () {
            return this.list.datasource;
        },

        /**
         * 设置补全数据
         *
         * @param {Array} datasource
         */
        setDatasource: function (datasource) {
            this.list.setProperties({
                datasource: datasource
            });
        }

    };

    AutoComplete.defaultOptions = {
        closed: true
    };

    AutoComplete.painter = {

        closed: function (autoComplete, closed) {

            var iteratorConfig = autoComplete.iteratorConfig;
            var list = autoComplete.list;

            if (!closed
                && (list.datasource && list.datasource.length > 0)
            ) {
                iteratorConfig.index = 0;
                iteratorConfig.max = list.datasource.length;
                iterator.enable(iteratorConfig);
                list.show();
            }
            else {
                iterator.disable(iteratorConfig);
                list.hide();
            }
        },

        value: function (autoComplete, value) {
            var textBox = autoComplete.textBox;

            textBox.setProperties({
                value: value
            });
        },

        placeholder: function (autoComplete, placeholder) {
            var textBox = autoComplete.textBox;
            textBox.setProperties({
                placeholder: placeholder
            });
        },

        width: function (autoComplete, width) {
            var textBox = autoComplete.textBox;
            textBox.setProperties({
                width: width
            });
        }
    };

    function createIteratorConfig(autoComplete) {
        return {
            min: 0,
            loop: true,
            scope: autoComplete,
            onenter: function (index) {
                var text;

                if (index === 0) {
                    text = this.value;
                }
                else {
                    index--;

                    var item = this.list.selectItemByIndex(index);
                    var data = item.raw;

                    if (typeof data === 'string') {
                        text = data;
                    }
                    else {
                        text = data.name || data.text;
                    }
                }

                this.textBox.setValue(text);
            },
            onleave: function (index) {
                if (index > 0) {
                    this.list.deselectItemByIndex(index - 1);
                }
            }
        };
    }

    /**
     * textbox 触发 focus
     *
     * @private
     */
    function onfocus() {

        if (this.local) {
            showSuggestion(this);
        }

        /**
         * @event AutoComplete#ui-focus
         */
        this.fire('ui-focus');
    }

    /**
     * textbox 触发 blur
     *
     * @private
     */
    function onblur() {

        var autoComplete = this;

        setTimeout(function () {

            if (autoComplete.stage < lib.LifeCycle.DISPOSED) {

                autoComplete.close();

                /**
                 * @event AutoComplete#ui-blur
                 */
                autoComplete.fire('ui-blur');
            }

        }, 150);
    }

    /**
     * textbox 触发 input
     *
     * @private
     */
    function oninput() {

        if (lib.keyPressed) {
            return;
        }

        // 判断是否要请求数据
        // 点击提示项触发的 input 事件不需要发请求
        updateInputValue(this);

        /**
         * @event AutoComplete#ui-input
         */
        this.fire('ui-input');
    }

    /**
     *  用户长按某键
     *    如果是字符键，直接无视(隐藏提示层)
     *
     * @private
     */
    function onkeydown(e) {

        var keyCode = e.keyCode;

        // 长按字符键直接无视
        if (lib.keyPressed && lib.isCharkey(keyCode)) {
            this.close();
        }

        // webkit，按上键，光标会跑到最左侧
        if (keyCode === lib.KEYCODE_UP) {
            e.preventDefault();
        }

        /**
         * @event AutoComplete#ui-keydown
         * @param {Object} e
         */
        this.fire('ui-keydown', e);
    }

    /**
     * textbox 触发 keyup
     *
     * 更新`用户输入值`
     */
    function onkeyup(e) {

        var keyCode = e.keyCode;

        if (lib.isCharkey(keyCode)) {
            updateInputValue(this);
            showSuggestion(this);
        }

        /**
         * @event AutoComplete#ui-keyup
         * @param {Object} e
         */
        this.fire('ui-keyup', e);
    }

    /**
     * 按下回车
     */
    function onsubmit(e) {

        // 如果某提示项选中时敲回车，可当作 submit 处理
        var item = e.item;

        this.close();

        // 如果提示层打开并选中了某项，需要更新`用户输入值`
        updateInputValue(this, item && item.raw);

        this.submit();
    }

    /**
     * 鼠标进入下拉列表项
     */
    function enterItem(e, params) {
        var group = params.group;
        var item = params.item;

        var index = item.index;

        this.iteratorConfig.index = index + 1;

        group.selectItemByIndex(index);
    }

    /**
     * 鼠标离开下拉列表项
     */
    function leaveItem(e, params) {
        var item = params.item;
        item.setProperties({
            selected: false
        });

        this.iteratorConfig.index = 0;
    }

    function clickItem(e, params) {
        var item = params.item;

        updateInputValue(this, item.raw);

        this.close();

        this.fire('ui-submit', {
            data: item.raw
        });
    }

    function enterGroup(e, params) {

        var group = params.group;

        group.setProperties({
            selected: true
        });
    }

    function leaveGroup(e, params) {
        var group = params.group;

        group.setProperties({
            selected: false
        });

    }

    function clickGroup(e, params) {
        var group = params.group;

        updateInputValue(this, group.raw);

        this.close();

        this.fire('ui-submit', {
            data: group.raw
        });
    }

    function beforeDispose() {
        this.textBox.dispose();
        this.list.dispose();
        iterator.disable(this.iteratorConfig);
    }

    /**
     * 更新`用户输入`值
     *
     * 用户输入值有以下几种：
     * 1. 直接输入
     * 2. 点击列表项
     */
    function updateInputValue(autoComplete, value) {

        var textBox = autoComplete.textBox;

        if (value) {
            if (typeof value !== 'string') {
                value = value.name || value.text;
            }
        }
        else {
            value = textBox.getValue();
        }

        autoComplete.setProperties({
            value: value
        });
    }

    /**
     * 如果配置了 datasource，从这里过滤取值
     * 如果配置了远程请求，需要异步取值
     */
    function showSuggestion(autoComplete) {

        var value = autoComplete.getValue();

        var callback = function (datasource) {

            autoComplete.list.setProperties({
                datasource: datasource
            });

            if (datasource.length > 0) {
                autoComplete.open();
            }
            else {
                autoComplete.close();
            }
        };

        var cache = autoComplete.cache;
        if (!cache) {
            cache = autoComplete.cache = { };
        }

        var datasource = cache[value];

        if ($.isArray(datasource) && datasource.length > 0) {

            callback(datasource);
        }
        else {
            var request = autoComplete.local || autoComplete.remote;

            if (typeof request === 'function') {
                request(function (data) {
                    cache[value] = data;
                    if (value === autoComplete.getValue()
                        && autoComplete.textBox.hasFocus()
                    ) {
                        callback(data);
                    }
                });
            }
        }
    }

    // 创建粗体
    function setStyle(data, value) {
        var len = value.length;
        $.each(data, function (item) {
            var text = item.text;
            if (text.slice(0, len) === value) {
                item.text = '<em>' + value + '</em>' + text.slice(len);
            }
        });
    }


    lib.inherits(AutoComplete, SuperClass);


    return AutoComplete;

});
