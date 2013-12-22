/**
 * @file TableRow
 * @author zhujl
 */
define(function(require) {

    'use strict';

    var SuperClass = require('./Item');
    var lib = require('../lib/lib');
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
