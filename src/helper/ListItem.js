/**
 * @file ListItem
 * @author zhujl
 */
define(function (require) {

    var SuperClass = require('./Item');
    var lib = require('./lib');
    var gui = require('../main');

    /**
     * 列表项的构造函数
     *
     * @constructor
     * @param {Object} options
     */
    function ListItem(options) {
        SuperClass.apply(this, arguments);
    }

    ListItem.prototype = {

    };

    ListItem.defaultOptions = {
        tagName: 'div'
    };

    var classPrefix = gui.config.uiClassPrefix + '-';

    /**
     * 列表项 class
     *
     * @static
     * @type {string}
     */
    ListItem.CLASS_ITEM = classPrefix + 'list-item';

    /**
     * 奇数列表项 class
     *
     * @static
     * @type {string}
     */
    ListItem.CLASS_ODD = classPrefix + 'list-item-odd';

    /**
     * 偶数列表项 class
     *
     * @static
     * @type {string}
     */
    ListItem.CLASS_EVEN = classPrefix + 'list-item-even';

    /**
     * 列表项选中时的 class
     *
     * @static
     * @type {string}
     */
    ListItem.CLASS_SELECTED = classPrefix + 'list-item-selected';

    /**
     * 列表项的 selectbox
     *
     * @static
     * @type {string}
     */
    ListItem.CLASS_SELECTBOX = classPrefix + 'list-item-selectbox';

    /**
     * 原始数据转换成 ListItem 对象数组
     */
    ListItem.create = SuperClass.create(function () {
        return ListItem;
    });


    lib.inherits(ListItem, SuperClass);


    return ListItem;

});
