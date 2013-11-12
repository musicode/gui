/**
 * @file Button
 * @author zhujl
 */
define(function (require) {

    'use strict';
    
    var SuperClass = require('./interface/BaseButton');
    var lib = require('./helper/lib');

    /**
     * 按钮
     *
     * @constructor
     * @param {Object} options
     * @param {(HTMLElement | jQuery)=} options.main 主元素
     * @param {number=} options.width 按钮宽度, 一般不用设置, 由样式 padding 负责
     * @param {number=} options.height 按钮高度, 一般不用设置, 由样式 height 负责
     * @param {boolean=} options.hidden 是否隐藏
     * @param {boolean=} options.disabled 是否置灰
     * @param {boolean=} options.selected 是否选中
     * @param {boolean=} options.toggle 是否可再次单击切换选中状态
     * @param {string=} options.label 按钮的文本
     * @param {string=} options.icon 按钮的图标
     * @param {string=} options.labelPlacement label 相对于图标的位置, 可选值包括 left, right
     */
    function Button(options) {
        SuperClass.apply(this, arguments);
    }

    Button.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'Button',

        /**
         * 初始化控件参数
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, Button.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 创建控件主元素
         *
         * @protected
         * @override
         * @return {HTMLElement}
         */
        createMain: function () {
            return document.createElement('button');
        }
    };

    /**
     * 默认配置
     *
     * @type {Object}
     */
    Button.defaultOptions = { };

    Button.painter = {

        height: function (button, height) {
            if (typeof height === 'number') {
                var main = button.main;
                var offset = main.outerHeight() - main.height();
                var value = (height - offset) + 'px';

                main.css({
                    height: value,
                    'line-height': value
                });
            }
        }
    };


    lib.inherits(Button, SuperClass);


    return Button;

});
