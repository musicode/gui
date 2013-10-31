/**
 * @file AutoComplete
 * @author zhujl
 */
define(function (require) {

    var SuperClass = require('./interface/Control');
    var Iterator = require('./helper/Iterator');

    var TextBox = require('./TextBox');
    var List = require('./List');

    var lib = require('./helper/lib');

    /**
     * 自动补全
     *
     * @constructor
     * @param {Object} options
     * @param {Array=} options.datasource
     * @param {string=} options.value
     * @param {string=} options.placeholder
     * @param {number=} options.width 输入框的宽度
     * @param {Function} options.remote
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
            var iterator = new Iterator({
                min: 0,
                loop: true
            });
            this.iterator = iterator;

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

            // 键盘遍历
            iterator.on('enter', onenter, this);
            iterator.on('leave', onleave, this);

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
            this.fire('submit');
        }

    };

    AutoComplete.defaultOptions = {
        datasource: [ ],
        closed: true
    };

    AutoComplete.painter = {

        datasource: function (autoComplete, datasource) {
            var list = autoComplete.list;
            list.setProperties({
                datasource: datasource
            });
        },

        closed: function (autoComplete, closed) {

            var iterator = autoComplete.iterator;
            var list = autoComplete.list;

            if (!closed
                && (list.datasource && list.datasource.length > 0)
            ) {
                iterator.start(0, 0, list.datasource.length);
                list.show();
            }
            else {
                iterator.stop();
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


    /**
     * textbox 触发 focus
     *
     * @private
     */
    function onfocus() {

        // 如果配了 datasource，可以直接用一下
        // 这样能稍稍提升点用户体验
        // 如果没配就算了，不至于去异步请求
        if (this.datasource) {
            showSuggestion(this);
        }

        /**
         * @event AutoComplete#focus
         */
        this.fire('focus');
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
                 * @event AutoComplete#blur
                 */
                autoComplete.fire('blur');
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
         * @event AutoComplete#input
         */
        this.fire('input');
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
         * @event AutoComplete#keydown
         * @param {Object} e
         */
        this.fire('keydown', e);
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
         * @event AutoComplete#keyup
         * @param {Object} e
         */
        this.fire('keyup', e);
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
        var item = params.item;
        var index = item.index;

        this.iterator.restart(index + 1);

        // 这里不能只用 item.setProperties({ selected: true });
        // 因为可能之前用方向键选中过一个，再滑入一个会出现同时选中两个的 bug
        this.list.selectItemByIndex(index);
    }

    /**
     * 鼠标离开下拉列表项
     */
    function leaveItem(e, params) {
        var item = params.item;
        item.setProperties({
            selected: false
        });

        this.iterator.restart();
    }

    function clickItem(e, params) {
        var item = params.item;

        updateInputValue(this, item.raw);

        this.close();
        this.submit();
    }

    function enterGroup(e) {

    }

    function leaveGroup() {

    }

    function clickGroup() {

    }

    function onenter(e, index) {
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
    }

    function onleave(e, index) {
        if (index > 0) {
            this.list.deselectItemByIndex(index - 1);
        }
    }

    function beforeDispose() {
        this.textBox.dispose();
        this.list.dispose();
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

        var textBox = autoComplete.textBox;
        var value = textBox.getValue();

        var callback = function (list) {

            if ($.isArray(list) && list.length > 0) {

                autoComplete.list.setProperties({
                    datasource: list
                });

                if (autoComplete.closed) {
                    autoComplete.open();
                }
            }
            else {
                autoComplete.close();
            }
        };

        var cache = autoComplete.cache;
        if (!cache) {
            cache = autoComplete.cache = { };
        }

        var list = cache[value];

        if ($.isArray(list) && list.length > 0) {

            callback(list);
        }
        else {
            var datasource = autoComplete.datasource;
            var remote = autoComplete.remote;

            list = [ ];

            if (datasource) {

                $.each(datasource, function (index, item) {
                    if ($.isPlainObject(item)) {
                        item = item.name || item.text;
                    }
                    if (lib.startWith(item, value)
                        && item.length > value.length
                    ) {
                        list.push(item);
                    }
                });

                callback(list);
            }
            else if (typeof remote === 'function') {
                remote(function (data) {
                    cache[value] = data;
                    if (value === textBox.getValue()
                        && textBox.hasFocus()
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
