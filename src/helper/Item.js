/**
 * 操作是否应该放到 Collection
 *
 * 因为 表格和列表 都有数据项的概念，而且又有分组，分组包含数据项
 * 所以其中涉及的最重要的对象就是 Item
 *
 * 这是一个抽象类，继承者有 ListItem 和 TableRow
 *
 */
define(function (require) {

    'use strict';
    
    var SuperClass = require('../interface/Control');
    var lib = require('./lib');
    var gui = require('../main');

    /**
     * 集合项
     *
     * @constructor
     * @param {Object} options
     * @param {number} options.index 当前 item 在集合中的索引
     * @param {Object} options.raw 原始数据
     * @param {boolean=} options.selected 是否选中
     * @param {string=} options.tagName 标签名
     * @param {Function=} options.itemTemplate 集合项模版方法
     */
    function Item(options) {
        SuperClass.apply(this, arguments);
    }

    Item.prototype = {

        /**
         * 初始化参数
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            var Class = this.constructor;
            lib.supply(options, Class.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 覆盖父类方法, 避免加上多余 class
         *
         * @protected
         * @override
         */
        initStructure: function () {
            this.on('beforedispose', beforeDispose);
        },

        /**
         * 创建对应的 DOM 元素
         * 有时为了性能考虑，也可以返回一段 HTML 字符串
         *
         * @protected
         * @override
         * @param {Object} options
         * @return {(HTMLElement | string)}
         */
        createMain: function (options) {

            var html;
            var data = options.raw;
            var itemTemplate = options.itemTemplate;

            if (typeof itemTemplate === 'function') {
                html = itemTemplate(options.raw);
            }
            else {
                html = typeof data === 'string' ? data : data.text;
            }

            var ItemClass = this.constructor;

            var classList = [ ItemClass.CLASS_ITEM ];
            var attr = '';

            classList.push( options.index % 2
                            ? ItemClass.CLASS_ODD
                            : ItemClass.CLASS_EVEN );

            if (options.selected) {
                attr = ' selected="selected"';
            }

            var tagName = options.tagName || ItemClass.defaultOptions.tagName;
            html = '<' + tagName + ' class="' + classList.join(' ') + '"' + attr + '>'
                 +    html
                 + '</' + tagName + '>';

            return lib.createElement(html);
        },

        /**
         * 获取 item 中的选择框
         *
         * @return {HTMLElement}
         */
        getSelectBox: function () {
            var Class = this.constructor;
            return this.main.find('.' + Class.CLASS_SELECTBOX)[0];
        }
    };

    /**
     * 默认配置
     *
     * @static
     * @type {Object}
     */
    Item.defaultOptions = {
        selected: false,
        tagName: 'div'
    };

    /**
     * 画笔
     *
     * @static
     * @type {Object}
     */
    Item.painter = {

        selected: function (item, selected) {

            var checkbox = item.getSelectBox();

            if (checkbox) {
                lib.setCheckboxChecked(checkbox, selected);
            }

            var main = item.main;
            if (selected) {
                main.attr('selected', 'selected');
            }
            else {
                main.removeAttr('selected');
            }
        }

    };

    var classPrefix = gui.config.uiClassPrefix + '-';

    /**
     * 集合项 class
     *
     * @static
     * @type {string}
     */
    Item.CLASS_ITEM = classPrefix + 'item';

    /**
     * 奇数集合项 class
     *
     * @static
     * @type {string}
     */
    Item.CLASS_ODD = classPrefix + 'item-odd';

    /**
     * 偶数集合项 class
     *
     * @static
     * @type {string}
     */
    Item.CLASS_EVEN = classPrefix + 'item-even';

    /**
     * 用于选中集合项的勾选框
     *
     * @static
     * @type {string}
     */
    Item.CLASS_SELECTBOX = classPrefix + 'item-selectbox';

    function beforeDispose() {
        this.main.remove();
    }

    /**
     * 原始数据转换成 Item 对象数组
     *
     * @param {Function} getClass Item 或子类的构造函数
     * @param {Object=} staticExtra 额外的参数
     * @return {Function}
     */
    Item.create = function (getClass) {

        /**
         * @param {number} startIndex 起始索引位
         * @param {Array} data 要转换的数据集合
         * @param {Function=} callback
         * @return {Array}
         */
        return function (startIndex, data, callback) {

            var ret = [];

            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                var index = startIndex + i;

                if (item instanceof Item) {
                    item.index = index;
                }
                else {

                    var options = {
                        index: index,
                        raw: item,
                        noDOM: true
                    };

                    if (typeof callback === 'function') {
                        callback(options);
                    }

                    var Class = getClass(item);
                    item = new Class(options);
                }

                ret.push(item);
            }

            return ret;
        };
    };

    lib.inherits(Item, SuperClass);

    return Item;

});
