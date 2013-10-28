/**
 * [TODO]
 * this.data 增删需要更新
 *
 * @file helper.Table
 * @author zhujl
 */
define(function (require) {

    var Item = require('./Item');
    var Collection = require('./Collection');

    var TableRow = require('./TableRow');
    var lib = require('./lib');

    /**
     * @constructor
     * @param {Object} options
     */
    function Table(options) {
        Collection.apply(this, arguments);
    }

    Table.painter = {

        datasource: function (table, datasource) {


        }

    };


    Table.ItemClass = TableRow;

    Table.CLASS_GROUP = 'table-group';
    Table.CLASS_GROUP_HEADER = 'table-group-header';
    Table.CLASS_GROUP_BODY = 'table-group-body'


    Table.create = Item.create(function (data) {
        return data.children ? Table : Table.ItemClass;
    });

    lib.inherits(Table, Collection);

    return Table;

});
