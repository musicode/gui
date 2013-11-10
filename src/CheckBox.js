/**
 * @class CheckBox
 * @author zhujl
 */
define(function (require) {

    var SuperClass = require('./interface/BaseButton');
    var lib = require('./helper/lib');

    /**
     * 复选框
     *
     * @constructor
     * @param {Object} options
     * @param {(HTMLElement | jQuery)=} options.main 主元素
     * @param {boolean=} options.hidden 是否隐藏
     * @param {boolean=} options.disabled 是否置灰
     * @param {boolean=} options.selected 是否选中
     * @param {string=} options.label 按钮的文本
     * @param {string=} options.value 复选框的值
     */
    function CheckBox(options) {
        SuperClass.apply(this, arguments);
    }

    CheckBox.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'CheckBox',

        /**
         * 初始化控件配置
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            
            lib.supply(options, CheckBox.defaultOptions);
            options.icon = lib.createElement('<span class="i-checkbox"></span>');

            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {
            SuperClass.prototype.initStructure.apply(this, arguments);
        },

        /**
         * 创建控件主元素
         *
         * @protected
         * @override
         * @return {HTMLElement}
         */
        createMain: function () {
            return document.createElement('label');
        }
    };

    CheckBox.defaultOptions = {
        toggle: true,
        labelPlacement: 'right'
    };

    CheckBox.painter = {

    };


    lib.inherits(CheckBox, SuperClass);

    return CheckBox;

});
