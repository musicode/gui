/**
 * @file List
 * @author zhujl
 */
define(function (require) {

    var SuperClass = require('./Collection');
    var Item = require('./Item');
    var ListItem = require('./ListItem');

    var lib = require('./lib');
    var gui = require('../main');

    /**
     * @constructor
     * @param {Object} options
     */
    function List(options) {
        SuperClass.apply(this, arguments);
    }

    /**
     * 列表项类
     *
     * @static
     * @type {Function}
     */
    List.ItemClass = ListItem;

    var classPrefix = gui.config.uiClassPrefix + '-list-';

    /**
     * 列表分组 class
     *
     * @static
     * @type {string}
     */
    List.CLASS_GROUP = classPrefix + 'group';

    /**
     * 列表分组头部 class
     *
     * @static
     * @type {string}
     */
    List.CLASS_GROUP_HEADER = classPrefix + 'group-header';

    /**
     * 列表分组主体 class
     *
     * @static
     * @type {string}
     */
    List.CLASS_GROUP_BODY = classPrefix + 'group-body';

    /**
     * 创建 List 分组的工厂方法
     *
     * @static
     * @type {Function}
     */
    List.create = Item.create(function (data) {
        return data.children ? List : List.ItemClass;
    });


    lib.inherits(List, SuperClass);


    return List;

});
