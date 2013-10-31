/**
 * @file TextBox
 * @author zhujl
 */
define(function (require) {

    var SuperClass = require('./interface/Inputable');
    var Range = require('./helper/Range');
    var lib = require('./helper/lib');
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

            lib.supply(options, TextBox.defaultOptions);

            if (!options.placeholder) {
                var placeholder = this.main.data('placeholder');
                if (placeholder) {
                    options.placeholder = placeholder;
                }
            }

            if (!options.value) {
                options.value = this.main.val();
            }

            SuperClass.prototype.initOptions.call(this, options);
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
         * 初始化控件 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            this.on('focus', onfocus);
            this.on('blur', onblur);
            this.on('input', oninput);

            SuperClass.prototype.initStructure.apply(this, arguments);
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
         *   text: 选区内的文本
         * }
         *
         * @return {Object}
         */
        getRange: function () {
            return Range.create(this.main[0]);
        },

        /**
         * 设置 range.start 到 range.end 之间的文本为 range.text
         *
         * @param {Object} range
         * @param {number} range.start
         * @param {number} range.end
         * @param {string} range.text
         */
        setRange: function (range) {
            range = new Range(range.start, range.end, range.text);
            range.replaceText(this, range.text);
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
    }

    function onblur(e) {
        if (this.value === '' && this.placeholder) {
            this.main.addClass(TextBox.CLASS_PLACEHOLDER);
            TextBox.painter.placeholder(this, this.placeholder);
        }
    }

    function oninput(e) {
        this.value = this.main.val();
    }

    lib.inherits(TextBox, SuperClass);


    return TextBox;

});