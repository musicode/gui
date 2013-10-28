/**
 * @file TextEditor
 * @author zhujl
 */
define(function (require) {

    var SuperClass = require('./interface/Control');
    var TextBox = require('./TextBox');
    var lib = require('./helper/lib');
    var gui = require('./main');

    /**
     * 简单的文本编辑器
     *
     * @constructor
     * @param {Object} options 配置
     * @param {HTMLElement} options.main
     * @param {string} options.placeholder
     * @param {boolean} options.wordWrap 是否允许换行
     * @param {number} options.width
     * @param {number} options.height
     */
    function TextEditor(options) {
        SuperClass.apply(this, arguments);
    }

    TextEditor.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'TextEditor',

        /**
         * 初始化控件参数
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, TextEditor.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化控件结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            var main = this.main;

            var html = '<ul class="' + TextEditor.CLASS_LINE_NUMBER + '"></ul>'
                     + '<div class="' + TextEditor.CLASS_LINE_TEXT + '">'
                     +     '<textarea></textarea>'
                     + '</div>';
            main.html(html);

            var lineNumber = $('.' + TextEditor.CLASS_LINE_NUMBER, main);
            var lineText = new TextBox({
                main: $('textarea', main)
            });
            lineText.render();

            lineText.on('scroll', onscroll, this);
            lineText.on('input', refresh, this);

            lineNumber.on('scroll', onscroll);

            this.lineNumber = lineNumber;
            this.lineText = lineText;

            this.one('beforedispose', beforeDispose);

            SuperClass.prototype.initStructure.apply(this, arguments);
        },

        /**
         * 创建控件主元素
         *
         * @protected
         * @return {HTMLElement}
         */
        createMain: function () {
            return document.createElement('div');
        },

        /**
         * 获取文本框中的值
         *
         * @return {string}
         */
        getValue: function () {
            return this.lineText.getValue();
        },

        /**
         * 设置文本框中的值
         */
        setValue: function (value) {
            this.lineText.setValue(value);
        },

        /**
         *
         * @return {Array}
         */
        getValueAsArray: function () {
            var value = this.getValue();
            return value.split(CHAR_WRAP);
        }
    };

    TextEditor.defaultOptions = {
        placeholder: '',
        wordWrap: true
    };

    TextEditor.painter = {

        hidden: SuperClass.painter.hidden,

        placeholder: function (textEditor, placeholder) {
            textEditor.lineText.setPlaceholder(placeholder);
        },

        width: function (textEditor, width) {
            var main = textEditor.main;
            main.width(width);
        },

        height: function (textEditor, height) {
            var main = textEditor.main;
            main.height(height);
        },

        wordWrap: function (textEditor) {
            var textarea = textEditor.lineText.main;
            // 参考 http://www.w3help.org/zh-cn/causes/HF1014
            if (textEditor.wordWrap) {
                textarea.css('word-wrap', 'break-word');
            } else {
                textarea.prop('wrap', 'off');
            }
        }
    };

    var classPrefix = gui.config.uiClassPrefix + '-texteditor-';

    /**
     * 行号 class
     *
     * @static
     * @type {string}
     */
    TextEditor.CLASS_LINE_NUMBER = classPrefix + 'line-number';

    /**
     * 行文本 class
     *
     * @static
     * @type {string}
     */
    TextEditor.CLASS_LINE_TEXT = classPrefix + 'line-text';

    // 换行符
    var CHAR_WRAP = '\n';

    function refresh(e) {

        var width = this.lineText.getWidth();

        var wordWrap = this.wordWrap;
        var element = this.main;

        var me = this;
        var html = '';

        $.each(this.getValueAsArray(), function (index, text) {
            var height;
            if (wordWrap) {
                height = getTextHeight(text, width, element);
            }
            html += createLine(index, text, height);
        });

        this.lineNumber.html(html);

        this.fire('change');
    }

    function beforeDispose() {
        this.lineNumber.off();
        this.lineText.dispose();
    }

    /**
     * 获得文本的高度
     *
     * 因为有宽度限制, 再加上行高, 计算高度很简单
     *
     * @param  {string} text
     * @param  {number} width
     * @param  {HTMLElement} element 行高取决于 element
     * @return {number}
     */
    function getTextHeight(text, width, element) {
        var p = $('<p style="width:' + width + 'px;">' + text + '</p>');
        p.appendTo(element);

        var height = p.height();
        p.remove();

        return height;
    }

    function onscroll(e) {
        var target = e.target;

        var lineNumber = this.lineNumber;
        var textBox = this.lineText.main;

        if (target.tagName === 'TEXTAREA') {
            lineNumber.scrollTop(textBox.scrollTop());
        } else {
            textBox.scrollTop(lineNumber.scrollTop());
        }
    }

    function createLine(index, text, height) {
        var html = '<li';
        if (height) {
            html += ' style="height:' + height + 'px;"';
        }
        return html + '>' + (index + 1) + '</li>';
    }

    lib.inherits(TextEditor, SuperClass);

    return TextEditor;

});
