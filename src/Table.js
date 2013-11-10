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
     * @param {string=} options.defaultText
     * @param {string=} options.loadingText
     * @param {string=} options.emptyText
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
            this.on('click', '.' + Table.CLASS_SORTABLE, sort);


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
        },

        /**
         * 切换成 loading 状态
         */
        loading: function () {
            var main = this.main;
            var body = main.find('.' + Table.CLASS_BODY);
            setBodyHTML(this, this.loadingText);
            main.addClass(Table.CLASS_LOADING);
        }
    };


    Table.defaultOptions = {
        datasource: [],
        defaultText: '',
        emptyText: '',
        loadingText: '',
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

        bodyHeight: function (table, bodyHeight) {
            var tableBody = table.main.find('.' + Table.CLASS_BODY);
            tableBody.height(bodyHeight);
        },

        bodyMaxHeight: function (table, maxHeight) {
            var tableBody = table.main.find('.' + Table.CLASS_BODY);
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

            var main = table.main;

            // 通过排序标识来判断
            if (!table.sorting) {
                // 去掉排序状态
                var element = main.find('th[data-sort-type]');
                element.removeAttr('data-sort-type');
            }
            else {
                delete table.sorting;
            }

            if (datasource.length === 0) {

                var isInited = table.stage === lib.LifeCycle.INITED;
                var body = main.find('.' + Table.CLASS_BODY);

                if (isInited) {
                    setBodyHTML(table, table.defaultText);
                    main.addClass(Table.CLASS_DEFAULT);
                }
                else {
                    setBodyHTML(table, table.emptyText);
                    main.addClass(Table.CLASS_EMPTY);
                }
            }
            else {

                main.removeClass(Table.CLASS_DEFAULT);
                main.removeClass(Table.CLASS_EMPTY);
                main.removeClass(Table.CLASS_LOADING);

                var helper = table.helper;
                // 清掉 helper 的 raw
                // 以防 setProperties 时判断出相等的情况
                helper.raw = null;

                helper.stopThreads();
                helper.setProperties({
                    raw: datasource
                });
            }

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
     * @private
     * @param {Object} field 外部传入的 field 配置
     * @param {string} style 样式字符串
     * @return {string}
     */
    function headerTemplate(field, style) {

        var tip = field.tip
                ? '<span data-ui="type:Tip;id:xxx;content:' + field.tip + '"></span>'
                : '';

        var className = field.sortable
                      ? 'class="' + Table.CLASS_SORTABLE + '" '
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
        var selectBox = multiple ? lib.getCheckbox([ Table.CLASS_ALLBOX ]) : ''; 
        return '<th style="width:35px;">' + selectBox + '</th>';
    }

    function getBodySelectBox(multiple) {

        var type = multiple ? 'checkbox' : 'radio';
        var selectBox = lib.getCheckbox([ TableRow.CLASS_SELECTBOX ]);

        return '<td class="' + TableRow.CLASS_CELL + '" style="width:35px;">'
             +    selectBox
             + '</td>';
    }

    /**
     * 为了实现水平垂直居中, 需要加一个元素
     */
    function setBodyHTML(table, html) {
        var body = table.main.find('.' + Table.CLASS_BODY);
        html = '<div class="' + classPrefix + 'body-wrapper">'
             +     html
             + '</div>';
        body.html(html);
    }

    function sort(e) {
        var datasource = this.datasource;
        if (datasource.length === 0) {
            return;
        }

        var target = $(e.currentTarget);

        // 排序方式
        var type = target.attr('data-sort-type');
        if (type) {
            type = type === 'asc' ? 'desc' : 'asc';
        }
        else {
            type = 'asc';
        }
        // 把之前排序的列恢复原状
        var element = target.parent().find('th[data-sort-type]');
        element.removeAttr('data-sort-type');

        target.attr('data-sort-type', type);

        this.datasource = null;
        this.sorting = true;

        // 计算是第几列
        var index = lib.getElementIndex(target[0]);
        if (this.selectMode === 'box' && this.multiple) {
            index--;
        }
        var field = this.fields[index].field;

        datasource.sort(sortBy(field, type));
        this.setProperties({
            datasource: datasource
        });
    }

    /**
     * 排序函数
     *
     * @param {string} name 排序的字段
     * @param {string} type 排序方式 asc 或 desc
     */
    function sortBy(name, type) {
        // 数字和时间用减法
        // 文本则localeCompare
        var compare;
        function numberic(value1, value2) {
            return value1 - value2;
        };
        function text(value1, value2) {
            return value1.localeCompare(value2);
        };

        return function (obj1, obj2) {
            var value1 = obj1[name];
            var value2 = obj2[name];

            if (!compare) {
                compare = isNaN(Number(value1)) ? text : numberic;
            }

            var ret = compare(value1, value2);
            return type === 'asc' ? ret : -1 * ret;
        };
    }

    function toggleAll(e) {
        var checkbox = e.target;
        var checked = !lib.getCheckboxChecked(checkbox);


        lib.setCheckboxChecked(checkbox, checked);

        this.helper.setProperties({
            selected: checked
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

                        lib.setCheckboxChecked(checkbox, selected === total);
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
     * 可排序
     */
    Table.CLASS_SORTABLE = classPrefix + 'sortable';

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
