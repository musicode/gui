/**
 * @file BaseButton
 * @author zhujl
 */
define(function (require) {

    var SuperClass = require('./Control');
    var lib = require('../helper/lib');
    var gui = require('../main');

    /**
     * Button 基类, 包括 checkbox radiobox 也继承于此
     *
     * @constructor
     * @param {Object} options
     * @param {(HTMLElement | jQuery)} options.main 主元素
     * @param {boolean=} options.hidden 是否隐藏
     * @param {boolean=} options.disabled 是否置灰
     * @param {boolean=} options.selected 是否选中
     * @param {boolean=} options.toggle 是否可再次单击切换选中状态
     * @param {string=} options.label 按钮的文本
     * @param {string=} options.icon 按钮的图标
     * @param {string=} options.labelPlacement label 相对于图标的位置, 可选值包括 left, right
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

            // 确定 label
            if (typeof options.label !== 'string') {
                var textNode = getTextNode(this.main);
                if (textNode) {
                    options.label = textNode.nodeValue;
                }
            }

            // 确定 icon
            if (typeof options.icon !== 'string') {
                var iconElement = getIconElement(this.main);
                if (iconElement) {
                    var icon = iconElement.className;
                    var prefix = gui.config.iconClassPrefix;

                    if (lib.startWith(icon, prefix)) {
                        icon = icon.substr(prefix.length);
                    }
                    options.icon = icon;
                }
            }

            lib.supply(options, BaseButton.defaultOptions);

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
            // note: 有时候模版换行会造成多余的文本节点
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
         * 获得图标名称
         *
         * @return {string}
         */
        getIcon: function () {
            return this.icon;
        },

        /**
         * 设置图标
         *
         * @param {string} icon 图标名称
         */
        setIcon: function (icon) {
            this.setProperties({
                icon: icon
            });
        }
    };

    /**
     * 默认配置
     *
     * @type {Object}
     */
    BaseButton.defaultOptions = {
        selected: false,
        toggle: false,
        labelPlacement: 'right'
    };

    BaseButton.painter = {

        selected: function (button, selected) {
            var main = button.main;
            if (selected) {
                main.attr('selected', 'selected');
            }
            else {
                main.removeAttr('selected');
            }
        },

        label: function (button, label) {
            var textNode = getTextNode(button.main);

            if (textNode) {
                textNode.nodeValue = label;
            }
            else if (label) {
                textNode = document.createTextNode(label);
                placeText(button, textNode);
            }
        },

        icon: function (button, icon) {
            var iconElement = getIconElement(button.main);

            if (icon) {
                if (!iconElement) {
                    iconElement = document.createElement('span');
                    placeIcon(button, iconElement);
                }
                iconElement.className = gui.config.iconClassPrefix + '-' + icon;
            }
            else if (iconElement) {
                iconElement.parentNode.removeChild(iconElement);
            }
        },

        cssIcon: function (button, cssIcon) {
            var iconElement = getIconElement(button.main);

            if (cssIcon) {
                if (!iconElement) {
                    iconElement = document.createElement('span');
                    placeIcon(button, iconElement);
                }
                iconElement.className = gui.config.uiClassPrefix + '-' + cssIcon;
            }
            else if (iconElement) {
                iconElement.parentNode.removeChild(iconElement);
            }
        },

        labelPlacement: function (button, labelPlacement) {
            var main = button.main;
            var textNode = getTextNode(main);
            var iconElement = getIconElement(main);

            if (textNode && iconElement) {
                placeIcon(button, iconElement);
            }
        },

        toggle: function (button, toggle) {
            var method = toggle ? 'on' : 'off';
            button[method]('click', ontoggle);
        }
    };

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
        if (element.jquery) {
            element = element[0];
        }

        var textNode;
        var text = '';

        var childNodes = element.childNodes;
        for (var i = childNodes.length - 1, node; i >= 0; i--) {
            node = childNodes[i];
            if (node.nodeType === 3) {
                if (textNode) {
                    element.removeChild(textNode);
                }
                textNode = node;
                text += node.nodeValue;
            }
        }

        if (textNode) {
            textNode.nodeValue = $.trim(text);
        }
    }

    function getTextNode(element) {
        return findChildNode(element, function (node) {
            return node.nodeType === 3;
        });
    }

    function getIconElement(element) {
        return findChildNode(element, function (node) {
            return node.nodeType === 1;
        });
    }

    /**
     * 查找子节点
     *
     * @param {jQuery} element
     * @param {Function} callback 查找条件
     * @return {(HTMLElement | TextNode)}
     */
    function findChildNode(element, callback) {

        var childNodes = element.contents();

        for (var i = 0, len = childNodes.length, node, nodeType; i < len; i++) {
            node = childNodes[i];
            nodeType = node.nodeType;
            if (callback(node)) {
                return node;
            }
        }
    }

    lib.inherits(BaseButton, SuperClass);

    return BaseButton;

});
