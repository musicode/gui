/**
 * @file BaseButton
 * @author zhujl
 */
define(function (require) {

    'use strict';

    var SuperClass = require('./Control');
    var lib = require('../lib/lib');
    var gui = require('../main');

    /**
     * Button 基类, 包括 checkbox radiobox 也继承于此
     *
     * @constructor
     * @param {Object} options
     * @param {jQuery=} options.main 主元素
     * @param {boolean=} options.hidden 是否隐藏
     * @param {boolean=} options.disabled 是否置灰
     * @param {boolean=} options.selected 是否选中
     * @param {boolean=} options.toggle 是否可再次单击切换选中状态
     * @param {string=} options.label 按钮的文本
     * @param {(string|HTMLElement)=} options.icon 按钮的图标
     * @param {string=} options.labelPlacement label 相对于图标的位置, 可选值包括 left, right
     * @param {number=} options.iconGutter 图标和文本的间距, 单位 px
     */
    function BaseButton(options) {
        SuperClass.apply(this, arguments);
    }

    BaseButton.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'BaseButton',

        /**
         * 初始化配置
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {

            if (typeof options.label !== 'string') {
                var textNode = getTextNode(this.main);
                if (textNode) {
                    options.label = textNode.nodeValue;
                }
            }

            var icon = options.icon;
            if (typeof icon !== 'string') {
                if (icon == null || icon.nodeType !== 1) {
                    var iconElement = getIconElement(this.main);
                    if (iconElement) {
                        options.icon = iconElement;
                    }
                }
            }

            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            // 清掉多余的文本节点
            // [note] 有时候模版换行会造成多余的文本节点
            removeExtraTextNode(this.main);

            SuperClass.prototype.initStructure.apply(this, arguments);
        },

        /**
         * 获得按钮文本
         *
         * @return {string}
         */
        getLabel: function () {
            return this.label;
        },

        /**
         * 设置按钮文本
         *
         * @param {string} label 按钮文本
         */
        setLabel: function (label) {
            this.setProperties({
                label: label
            });
        },

        /**
         * 获得图标
         *
         * @return {(string|HTMLElement)}
         */
        getIcon: function () {
            return this.icon;
        },

        /**
         * 设置图标
         *
         * @param {(string|HTMLElement)} icon 图标
         */
        setIcon: function (icon) {
            this.setProperties({
                icon: icon
            });
        }
    };

    /**
     * BaseButton 默认配置
     *
     * @static
     * @type {Object}
     */
    BaseButton.defaultOptions = {
        selected: false,
        toggle: false,
        labelPlacement: 'right',
        iconGutter: 4
    };

    /**
     * 属性渲染器
     *
     * @static
     * @type {Array}
     */
    BaseButton.painters = [

        {
            name: 'selected',
            painter: function (button, selected) {
                var main = button.main;

                if (selected) {
                    main.attr('selected', 'selected');
                }
                else {
                    main.removeAttr('selected');
                }
            }
        },

        {
            name: ['label', 'icon'],
            painter: function (button, label, icon) {

                if (label !== undefined) {
                    var textNode = getTextNode(button.main);

                    if (textNode) {
                        textNode.nodeValue = label;
                    }
                    else if (label) {
                        textNode = document.createTextNode(label);
                        placeText(button, textNode);
                    }
                }

                var iconElement = getIconElement(button.main);
                if (icon !== undefined) {
                    if (icon) {
                        // 有则改之，无则新建
                        if (iconElement) {
                            if (typeof icon === 'string') {
                                iconElement.className = gui.config.iconClassPrefix
                                                      + '-'
                                                      + icon;
                            }
                            else {
                                iconElement.parentNode.replaceChild(icon, iconElement);
                            }
                        }
                        else {
                            if (typeof icon === 'string') {
                                iconElement = document.createElement('i');
                                iconElement.className = gui.config.iconClassPrefix
                                                      + '-'
                                                      + icon;
                            }
                            else {
                                iconElement = icon;
                            }
                            placeIcon(button, iconElement);
                        }
                    }
                    else if (iconElement) {
                        iconElement.parentNode.removeChild(iconElement);
                        iconElement = null;
                    }
                }

                // 设置边距
                if (iconElement) {
                    var name = lib.camelize('margin-' + button.labelPlacement);
                    if (button.label) {
                        var value = button.iconGutter + 'px';
                        iconElement.style[name] = value;
                    }
                    else {
                        iconElement.style[name] = '';
                    }
                }
            }
        },

        {
            name: 'labelPlacement',
            painter: function (button, labelPlacement) {
                var main = button.main;
                var textNode = getTextNode(main);
                var iconElement = getIconElement(main);

                if (textNode && iconElement) {
                    placeIcon(button, iconElement);
                }
            },
        },

        {
            name: 'toggle',
            painter: function (button, toggle) {
                var method = toggle ? 'on' : 'off';
                button[method]('click', ontoggle);
            }
        }
    ];

    /**
     * 交替选中状态
     */
    function ontoggle(e) {
        this.setProperties({
            selected: !this.selected
        });
    }

    /**
     * 放置文本
     *
     * @param {BaseButton} button
     * @param {TextNode} text
     */
    function placeText(button, text) {
        var main = button.main;
        if (button.labelPlacement === 'left') {
            main.prepend(text);
        }
        else {
            main.append(text);
        }
    }

    /**
     * 放置图标
     *
     * @param {BaseButton} button
     * @param {HTMLElement} icon
     */
    function placeIcon(button, icon) {
        var main = button.main;
        if (button.labelPlacement === 'left') {
            main.append(icon);
        }
        else if (button.labelPlacement === 'right') {
            main.prepend(icon);
        }
    }

    /**
     * 移除额外的文本节点
     *
     * @param {jQuery} element
     */
    function removeExtraTextNode(element) {

        var textNode;
        var text = '';

        element = element[0];

        lib.traverseChildren(element, function (current) {
            if (current.nodeType === 3) {

                if (!textNode) {
                    textNode = current;
                }
                else {
                    element.removeChild(current);
                }

                text += current.nodeValue;
            }
        });

        if (textNode) {
            textNode.nodeValue = $.trim(text);
        }
    }

    /**
     * 获得 element 元素下的文本节点
     *
     * @param {jQuery} element
     * @return {TextNode}
     */
    function getTextNode(element) {
        var result;

        lib.traverseChildren(element[0], function (current) {
            if (current.nodeType === 3) {
                result = current;
            }
        });

        return result;
    }

    /**
     * 获得 element 元素下的图标元素
     *
     * @param {jQuery} element
     * @return {HTMLElement}
     */
    function getIconElement(element) {
        var result;

        lib.traverseChildren(element[0], function (current) {
            if (current.nodeType === 1) {
                result = current;
            }
        });

        return result;
    }

    lib.inherits(BaseButton, SuperClass);


    return BaseButton;

});
