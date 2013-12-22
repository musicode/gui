/**
 * @file Button
 * @author zhujl
 */
define(function (require) {

    'use strict';

    var SuperClass = require('./interface/BaseButton');
    var lib = require('./lib/lib');

    /**
     * 按钮
     *
     * @constructor
     * @param {Object} options
     * @param {jQuery=} options.main 主元素
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
     * @static
     * @type {Object}
     */
    Button.defaultOptions = { };

    /**
     * 属性渲染器
     *
     * @static
     * @type {Array}
     */
    Button.painters = [
        {
            name: 'height',
            painter: function (button, height) {
                if ($.isNumeric(height)) {
                    height = height + 'px';
                    button.main.css({
                        height: height,
                        'line-height': height
                    });
                }
            }
        }
    ];

    lib.inherits(Button, SuperClass);

    return Button;

});
