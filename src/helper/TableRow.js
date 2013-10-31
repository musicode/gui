/**
 * @file TableRow
 * @author zhujl
 */
define(function(require) {

    var SuperClass = require('./Item');
    var lib = require('./lib');
    var gui = require('../main');

    /**
     * 表格行
     *
     * @constructor
     * @param {Object} options
     */
    function TableRow(options) {
        SuperClass.apply(this, arguments);
    }

    TableRow.defaultOptions = {
        tagName: 'table'
    };

    var classPrefix = gui.config.uiClassPrefix + '-';

    /**
     * 单元格 class
     *
     * @static
     * @type {string}
     */
    TableRow.CLASS_CELL = classPrefix + 'table-cell';

    /**
     * 表格行 class
     *
     * @static
     * @type {string}
     */
    TableRow.CLASS_ITEM = classPrefix + 'table-row';

    /**
     * 表格行选中状态的 class
     *
     * @static
     * @type {string}
     */
    TableRow.CLASS_SELECTED = classPrefix + 'table-row-selected';

    /**
     * 奇数表格行 class
     *
     * @static
     * @type {string}
     */
    TableRow.CLASS_ODD = classPrefix + 'table-row-odd';

    /**
     * 偶数表格行 class
     *
     * @static
     * @type {string}
     */
    TableRow.CLASS_EVEN = classPrefix + 'table-row-even';

    /**
     * 表格行中的选择框
     *
     * @static
     * @type {string}
     */
    TableRow.CLASS_SELECTBOX = classPrefix + 'table-selectbox';

    /**
     * 原始数据转换成 TableRow 对象数组
     *
     * @static
     */
    TableRow.create = SuperClass.create(function () {
        return TableRow;
    });


    lib.inherits(TableRow, SuperClass);


    return TableRow;

});