/**
 * @file TextEditor
 * @author zhujl
 */
define(function (require) {

    'use strict';

    var SuperClass = require('./interface/Control');
    var CodeMirror = require('./lib/codemirror/lib/codemirror');
    var lib = require('./lib/lib');
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

            var codeMirror = CodeMirror(
                this.main[0],
                {
                    value: '',
                    placeholder: this.placeholder,
                    lineNumbers: true,
                    lineWrapping: this.wordWrap
                }
            );

            var me = this;
            var onfocus = function () {
                me.trigger('ui-focus');
            };
            var onblur = function () {
                me.trigger('ui-blur');
            };
            codeMirror.on('focus', onfocus);
            codeMirror.on('blur', onblur);

            this.codeMirror = codeMirror;

            this.on('beforeDispose', function () {
                codeMirror.off('focus', onfocus);
                codeMirror.off('blur', onblur);
            });

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
            return this.codeMirror.getValue();
        },

        /**
         * 设置文本框中的值
         */
        setValue: function (value) {
            this.codeMirror.setValue(value);
        },

        /**
         * 获得数组形式的 value
         *
         * @return {Array.<string>}
         */
        getLines: function () {
            var value = this.getValue();
            var result = value.split('\n');

            for (var i = result.length - 1; i >=0; i--) {
                result[i] = $.trim(result[i]);
                if (!result[i]) {
                    result.splice(i, 1);
                }
            }

            return result;
        },

        /**
         * 获得去重后的 value
         *
         * @return {Array.<string>}
         */
        getUniqueLines: function () {
            var result = [ ];
            var cache = { };
            $.each(this.getLines(), function (index, line) {
                if (!cache[line]) {
                    cache[line] = 1;
                    result.push(line);
                }
            });

            return result;
        }
    };

    TextEditor.defaultOptions = {
        placeholder: '',
        wordWrap: true
    };

    TextEditor.painter = {

        placeholder: function (textEditor, placeholder) {
            return;
            textEditor.lineText.setPlaceholder(placeholder);
        }
    };

    lib.inherits(TextEditor, SuperClass);

    return TextEditor;

});
