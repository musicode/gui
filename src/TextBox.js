/**
 * @file TextBox
 * @author zhujl
 */
define(function (require) {

    'use strict';
    
    var SuperClass = require('./interface/Control');
    var Range = require('./lib/Range');
    var lib = require('./lib/lib');
    var gui = require('./main');

    /**
     * 文本输入框
     *
     * @constructor
     * @param {Object} options
     * @param {string=} options.placeholder
     * @param {string=} options.value
     * @param {string=} options.mode 可选值包括: text textarea password
     * @param {number=} options.width
     * @param {boolean=} options.disabled
     * @param {boolean=} options.hidden
     */
    function TextBox(options) {
        SuperClass.apply(this, arguments);
    }

    TextBox.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'TextBox',

        /**
         * 初始化控件参数
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {

            if (typeof options.placeholder !== 'string') {
                var placeholder = this.main.data('placeholder');
                if (placeholder) {
                    options.placeholder = placeholder;
                }
            }

            if (typeof options.value !== 'string') {
                options.value = this.main.val();
            }

            lib.supply(options, TextBox.defaultOptions);

            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化控件 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            this.range = new Range(this.main[0]);

            this.on('focus', onfocus);
            this.on('blur', onblur);
            this.on('keydown', onkeydown);
            this.on('keyup', onkeyup);

            if (lib.supportInputEvent) {
                this.on('input', oninput);
            }
            else {
                this.on('propertychange', onpropertychange);
            }


            SuperClass.prototype.initStructure.apply(this, arguments);
        },

        /**
         * 创建控件主元素
         *
         * @protected
         * @override
         * @param {Object} options
         * @return {HTMLElement}
         */
        createMain: function (options) {

            var element;
            var mode = options.mode || TextBox.defaultOptions.mode;

            if (mode === 'text') {
                element = document.createElement('input');
                element.type = 'text';
            }
            else if (mode === 'textarea') {
                element = document.createElement('textarea');
            }
            else if (mode === 'password') {
                element = document.createElement('input');
                element.type = 'password';
            }

            return element;
        },

        /**
         * 输入框聚焦
         */
        focus: function () {
            this.main.focus();
        },

        /**
         * 输入框失焦
         */
        blur: function () {
            this.main.blur();
        },

        /**
         * 输入框是否是失焦状态
         *
         * @return {boolean}
         */
        hasFocus: function () {
            var element = this.main[0];
            var activeElement = element.ownerDocument.activeElement;

            return activeElement === element;
        },

        /**
         * 获得文本框的 placeholder
         *
         * @return {string}
         */
        getPlaceholder: function () {
            return this.placeholder;
        },

        /**
         * 设置文本框 placeholder
         *
         * @param {string} placeholder
         */
        setPlaceholder: function (placeholder) {
            this.setProperties({
                placeholder: placeholder
            });
        },

        /**
         * 获得文本框的值
         *
         * @return {string}
         */
        getValue: function () {
            return this.value;
        },

        /**
         * 设置文本框的值
         *
         * @param {string} value
         */
        setValue: function (value) {
            this.setProperties({
                value: value
            });
        },

        /**
         * 获得文本框的宽度
         *
         * @return {number}
         */
        getWidth: function () {
            return this.main.width();
        },

        /**
         * 设置文本框的宽度
         *
         * @param {number} width
         */
        setWidth: function (width) {
            this.setProperties({
                width: width
            });
        },

        /**
         * 获取或设置组件的 Range 对象
         * Range 对象结构如下：
         * {
         *   start: 选区开始位置
         *   end: 选区结束位置
         * }
         *
         * @return {Object}
         */
        getRange: function () {
            var range = this.range;
            return {
                start: range.getStart(),
                end: range.getEnd()
            };
        },

        /**
         * 设置选区范围
         *
         * @param {number} start
         * @param {number} end
         */
        setRange: function (start, end) {
            this.range.setRange(start, end);
        },

        /**
         * 获取选区文本
         * 
         * @return {string}
         */
        getRangeText: function () {
            return this.range.getText();
        },

        /**
         * 设置选区文本
         * 
         * @param {string} text
         */
        setRangeText: function (text) {
            this.range.setText(text);
        }

    };


    TextBox.defaultOptions = {
        placeholder: '',
        value: '',
        mode: 'text'
    };

    TextBox.painter = {

        value: function(textBox, value) {
            var main = textBox.main;

            // 避免赋值触发 input 事件
            textBox.byManual = true;

            if (!textBox.hasFocus()) {
                if (value) {
                    main.val(value);
                    if (textBox.placeholder) {
                        main.removeClass(TextBox.CLASS_PLACEHOLDER);
                    }
                }
            }
            else {
                main.val(value);
            }
        },

        placeholder: function(textBox, placeholder) {

            var main = textBox.main;

            if (placeholder) {
                main.data('placeholder', placeholder);
            }
            else if (main.data('placeholder')) {
                main.removeData('placeholder');
            }

            if (!textBox.hasFocus()
                && textBox.value === ''
                && placeholder
            ) {
                // 避免赋值触发 input 事件
                textBox.byManual = true;

                main.val(placeholder);
                main.addClass(TextBox.CLASS_PLACEHOLDER);
            }
        },

        disabled: function (textBox, disabled) {
            var main = textBox.main;
            if (disabled) {
                main.attr('disabled', 'disabled');
            }
            else {
                main.removeAttr('disabled');
            }
        }
    };

    var classPrefix = gui.config.uiClassPrefix + '-textbox-';

    /**
     * 占位符状态的 class
     *
     * @static
     * @type {string}
     */
    TextBox.CLASS_PLACEHOLDER = classPrefix + 'placeholder';

    function onfocus(e) {
        if (this.value === '' && this.placeholder) {
            this.main.removeClass(TextBox.CLASS_PLACEHOLDER);
            TextBox.painter.value(this, '');
        }
        this.fire('ui-focus');
    }

    function onblur(e) {
        if (this.value === '' && this.placeholder) {
            this.main.addClass(TextBox.CLASS_PLACEHOLDER);
            TextBox.painter.placeholder(this, this.placeholder);
        }
        this.fire('ui-blur');
    }

    function onkeydown(e) {
        // 清掉标识
        if (this.byManual) {
            delete this.byManual;
        }
    }

    function onkeyup(e) {

        if (e.keyCode === 13) {

            /**
             * @event Inputable#submit
             */
            this.fire('submit');
        }
    }

    function oninput(e) {
        this.value = this.main.val();
    }

    /**
     * 纠正低版本 IE
     */
    function onpropertychange(e) {
        var name = e.originalEvent.propertyName;
        if (name === 'value') {
            // 手动触发需要过滤掉
            if (this.byManual) {
                delete this.byManual;
                return false;
            }
            else {

                this.value = this.main.val();

                /**
                 * @event Inputable#input
                 */
                this.fire('input');
            }
        }
    }

    lib.inherits(TextBox, SuperClass);


    return TextBox;

});
