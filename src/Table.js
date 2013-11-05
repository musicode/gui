/**
 * @file Table
 * @author zhujl
 */
define(function (require) {

    var SuperClass = require('./interface/Control');
    var TableHelper = require('./helper/Table');
    var TableRow = require('./helper/TableRow');
    var lib = require('./helper/lib');
    var gui = require('./main');

    /**
     * Table
     *
     * @constructor
     * @param {Object} options
     * @param {Array} options.fields 字段配置
     * @param {Array} options.datasource 数据
     * @param {string} options.selectMode 选择模式 box 或 line
     * @param {boolean} options.multiple 是否可多选
     * @param {number} options.bodyHeight body 高度
     * @param {number} options.bodyMaxHeight body 最大高度
     * @param {string} options.status 状态 default | loading | empty
     * @param {string=} options.defaultHtml
     * @param {string=} options.loadingHtml
     * @param {string=} options.emptyHtml
     */
    function Table(options) {
        SuperClass.apply(this, arguments);
    }

    Table.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'Table',

        /**
         * 初始化控件参数
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, Table.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            var main = this.main;
            main.html(template);

            this.helper = createHelper(this);
            this.helper.on('click', clickBody, this);

            if (this.selectMode === 'box' && this.multiple) {
                this.on('click', '.' + Table.CLASS_ALLBOX, toggleAll);
            }

            SuperClass.prototype.initStructure.apply(this, arguments);
        },

        /**
         * 创建控件主元素
         *
         * @protected
         * @override
         * @return {HTMLElement}
         */
        createMain: function () {
            return document.createElement('div');
        }
    };


    Table.defaultOptions = {
        multiple: false,
        breakLine: false
    };

    Table.painter = {

        breakLine: function (table, newValue, oldValue) {
            var main = table.main;
            if (newValue) {
                main.attr('breakline', 'breakline');

                if (oldValue === false) {
                    main.removeAttr('overflow');
                }
            }
            else {
                main.attr('overflow', 'overflow');

                if (oldValue === true) {
                    main.removeAttr('breakline');
                }
            }
        },

        maxBodyHeight: function (table, maxBodyHeight) {
            var tableBody = $('.' + Table.CLASS_BODY, table.main);
            tableBody.css({
                'max-height': maxBodyHeight
            });
        },

        fields: function (table, fields) {
            var html = '';

            var styles = getFieldsStyle(table);

            if (table.selectMode === 'box') {
                html += getHeaderSelectBox(table.multiple);
            }

            for (var i = 0, len = fields.length; i < len; i++) {
                html += headerTemplate(fields[i], styles[i]);
            }

            html = '<table><tr>' + html + '</tr></table>';

            var header = $('.' + Table.CLASS_HEADER, table.main);
            header.html(html);
        },

        datasource: function (table, datasource) {

            var isInited = table.stage === lib.LifeCycle.INITED;
            var main = table.main;

            if (isInited) {
                if (datasource == null) {
                    main.addClass(Table.CLASS_DEFAULT);
                }
                else if (datasource.length === 0) {
                    main.html(table.emptyText || '');
                    main.addClass(Table.CLASS_EMPTY);
                }
            }
            else {

                if (main.hasClass(Table.CLASS_DEFAULT)) {
                    main.removeClass(Table.CLASS_DEFAULT);
                }

                if (datasource && datasource.length > 0) {
                    main.removeClass(Table.CLASS_EMPTY);
                }
                else if (!main.hasClass(Table.CLASS_EMPTY)) {
                    main.html(table.emptyText || '');
                    main.addClass(Table.CLASS_EMPTY);
                }
            }

            table.helper.stopThreads();
            table.helper.setProperties({
                raw: datasource
            });
        }
    };


    /**
     * 创建 helper/Table
     *
     * 这段逻辑比较长, 单独写个方法比较清晰
     *
     * @param {Table} table
     * @return {helper.Table}
     */
    function createHelper(table) {

        var TableClass = table.constructor;
        var body = $('.' + TableClass.CLASS_BODY, table.main);
        var styles;

        var options = {
            main: body,
            multiple: table.multiple,
            itemTemplate: function (data) {

                // 提升性能，避免重复计算
                if (styles == null) {
                    styles = getFieldsStyle(table);
                }

                var html = '';
                var fields = table.fields;
                var style;

                if (table.selectMode === 'box') {
                    html += getBodySelectBox(table.multiple);
                }

                for (var i = 0, len = fields.length; i < len; i++) {
                    html += '<td class="' + TableRow.CLASS_CELL + '" style="' + styles[i] + '">'
                          +     fields[i].content(data)
                          + '</td>';
                }

                return '<tr>' + html + '</tr>';
            },
            insertCompleteHandler: function () {
                // 清掉, 以便下次渲染会计算最新的样式
                styles = null;

                // 渲染完后 table-body 可能出现滚动条，因此最好重新算
                var scrollWidth = lib.getScrollbarWidth(body);
                if (scrollWidth > 0) {
                    var header = body.prev();
                    header.css('padding-right', scrollWidth);
                }

                /**
                 * @event Table#render-complete
                 */
                table.fire('render-complete');
            }
        };

        var helper = new TableHelper(options);
        helper.render();

        return helper;
    }

    /**
     * 表头单元格模版方法
     *
     * @inner
     * @param {Object} field 外部传入的 field 配置
     * @param {string} style 样式字符串
     * @return {string}
     */
    function headerTemplate(field, style) {

        var tip = field.tip
                ? '<span data-ui="type:Tip;id:xxx;content:' + field.tip + '"></span>'
                : '';

        var className = field.sortable
                      ? 'class="ui-sortable" '
                      : '';

        return '<th ' + className + 'style="' + style + '">'
              +    tip
              +    '<strong>' + field.title + '</strong>'
              + '</th>';
    }

    /**
     * 计算宽度的策略
     *
     * @type {Object}
     */
    var widthStrategy = {

        /**
         * 平均分配
         * 如果该列没有指定宽度
         * 宽度= 剩下的宽度 / 剩下的列数
         *
         * @param {number} width 剩下的宽度
         * @param {number} size 剩下的列数
         * @param {Object} field 列配置
         */
        byAverage: function (width, size, field) {
            if (size === 1) {
                return width;
            }
            if (field.width) {
                return field.width;
            }
            return width / size;
        }
    };


    /**
     * 获得内联样式
     *
     * @param {ui.Table} table
     * @return {Array}
     */
    function getFieldsStyle(table) {

        var styles = [ ];

        // 剩下的宽度
        var body = $('.' + Table.CLASS_BODY, table.main);
        var leftWidth = (body.width()).toFixed(1);
        var fields = table.fields;

        var filed;
        var style;
        var width;

        for (var i = 0, len = fields.length; i < len; i++) {
            field = fields[i];

            // 计算当前列的宽度
            width = widthStrategy.byAverage(leftWidth, len - i, field);
            width = (width).toFixed(1);
            leftWidth -= width;

            style = 'width:' + width + 'px;';
            if (!table.breakLine) {
                // 开启截断处理
                style += 'max-width:' + width + 'px;';
            }
            if (field.align) {
                style += 'text-align:' + field.align;
            }

            styles.push(style);
        }

        return styles;
    }


    function getHeaderSelectBox(multiple) {
        var selectBox = multiple
                      ? '<input class="' + Table.CLASS_ALLBOX + '" type="checkbox" />'
                      : '';
        return '<th style="width:35px;">' + selectBox + '</th>';
    }

    function getBodySelectBox(multiple) {

        var type = multiple ? 'checkbox' : 'radio';
        var selectBox = '<input class="' + TableRow.CLASS_SELECTBOX
                      + '" type="' + type + '" />';

        return '<td class="' + TableRow.CLASS_CELL + '" style="width:35px;">'
             +    selectBox
             + '</td>';
    }

    function toggleAll(e) {
        var checkbox = e.target;
        this.helper.setProperties({
            selected: checkbox.checked
        });
    }

    function clickBody(e) {
        var group = e.group;
        var item = e.item;

        if (item) {
            clickRow.apply(this, arguments);
        }
        else if (group) {
            clickGroup.apply(this, arguments);
        }
    }

    function clickRow(e) {
        var helper = this.helper;

        var tableRow = e.item;
        var selected = !tableRow.selected;

        var index = tableRow.index;
        switch (this.selectMode) {

            case 'line':

                if (selected) {
                    helper.selectItemByIndex(index);
                }
                else {
                    tableRow.setProperties({
                        selected: false
                    });
                }

                break;

            case 'box':

                var target = e.target;

                if (target.className.indexOf(TableRow.CLASS_SELECTBOX) !== -1) {
                    if (selected) {
                        helper.selectItemByIndex(index);
                    }
                    else {
                        tableRow.setProperties({
                            selected: false
                        });
                    }

                    if (this.multiple) {
                        var checkbox = this.main.find('.' + Table.CLASS_ALLBOX);
                        var selected = helper.getSelectedItems().length;
                        var total = this.datasource.length;

                        checkbox.prop('checked', selected === total);
                    }
                }

                break;
        }
    }

    function clickGroup(e) {

    }


    var classPrefix = gui.config.uiClassPrefix + '-table-';

    /**
     * 表格 header 的 class
     *
     * @static
     * @type {string}
     */
    Table.CLASS_HEADER = classPrefix + 'header';

    /**
     * 表格 body 的 class
     */
    Table.CLASS_BODY = classPrefix + 'body';

    /**
     * 全选/反选 class
     */
    Table.CLASS_ALLBOX = classPrefix + 'allbox';

    /**
     * 表格默认状态的 class
     * 此状态只存在创建表格时，未设置 datasource
     *
     * @static
     * @type {string}
     */
    Table.CLASS_DEFAULT = classPrefix + 'default';

    /**
     * 表格的数据正在加载状态的 class
     *
     * @static
     * @type {string}
     */
    Table.CLASS_LOADING = classPrefix + 'loading';

    /**
     * 表格数据为空状态的 class
     *
     * @staic
     * @type {string}
     */
    Table.CLASS_EMPTY = classPrefix + 'empty';


    var template = '<div class="' + Table.CLASS_HEADER + '"></div>'
                 + '<div class="' + Table.CLASS_BODY + '"></div>';


    lib.inherits(Table, SuperClass);


    return Table;

});
