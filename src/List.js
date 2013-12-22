/**
 * @file List
 * @author zhujl
 */
define(function (require) {

    'use strict';

    var SuperClass = require('./interface/Control');
    var ListHelper = require('./helper/List');
    var ScrollPanel = require('./ScrollPanel');
    var lib = require('./lib/lib');
    var gui = require('./main');

    /**
     * 列表
     *
     * @constructor
     * @param {Object} options
     * @param {Array=} options.datasource      数据 [ { name: 'xx', value: 'xx' } ]
     *                                         或   [ { text: 'xx', value: 'xx' } ]
     *                                         或   [ 'xx', 'yy', 'zz' ]
     *
     * @param {number=} options.maxHeight      列表最大高度
     * @param {boolean=} options.multiple      是否支持多选(不支持分组)
     * @param {boolean=} options.toggle        是否支持第二次选中变成反选
     * @param {boolean=} options.overflow      字数超长是否截断处理
     * @param {string=} options.defaultText    初始化时无数据的提示文本
     * @param {string=} options.emptyText      空数据的提示文本
     * @param {string=} options.loadingText    加载数据时的提示文本
     * @param {Function=} options.groupHeaderTemplate
     * @param {Function=} options.itemTemplate
     */
    function List(options) {
        SuperClass.apply(this, arguments);
    }

    List.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'List',

        /**
         * 初始化 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            SuperClass.prototype.initStructure.apply(this, arguments);

            var scrollPanel = new ScrollPanel({
                main: this.main
            });
            scrollPanel.render();
            this.scrollPanel = scrollPanel;

            var contentArea = scrollPanel.getContentArea();
            this.helper = new ListHelper({
                main: contentArea,
                multiple: this.multiple,
                itemTemplate: this.itemTemplate,
                groupHeaderTemplate: this.groupHeaderTemplate,
                insertCompleteHandler: function () {
                    scrollPanel.trigger('propertyChange', {
                        content: contentArea.html()
                    });
                }
            });
            this.helper.render();

            this.on('click', onclick);
            this.on('mouseover', onmouseover);
            this.on('mouseout', onmouseout);
            this.one('beforedispose', beforeDispose);
        },

        /**
         * 追加列表项
         *
         * @param {Array} data 要追加的数据
         */
        appendItems: function (data) {
            var helper = this.helper;
            var index = helper.items.length;
            helper.insertItems(index, data);
        },

        /**
         * 插入列表项
         *
         * @param {number} index 插入的位置
         * @param {Array} data 插入的数据
         */
        insertItems: function (index, data) {
            var helper = this.helper;
            helper.insertItems(index, data);
        },

        /**
         * 移除列表项
         *
         * @param {number} index 移除的开始位置
         * @param {number} length 移除的数量
         */
        removeItems: function (index, length) {
            var helper = this.helper;
            helper.removeItems(index, length);
        },

        /**
         * 追加列表分组
         *
         * @param {Array} data 追加的分组数据
         *                     [ { text: xx, value: xx, children: [] }]
         */
        appendGroups: function (data) {
            var helper = this.helper;
            var index = helper.items.length;
            helper.insertItems(index, data);
        },

        /**
         * 插入列表分组
         *
         * @param {number} index 插入的位置
         * @param {Array} data 插入的分组数据
         *                     [ { text: xx, value: xx, children: [] }]
         */
        insertGroups: function (index, data) {
            var helper = this.helper;
            helper.insertItems(index, data);
        },

        /**
         * 移除列表分组
         *
         * @param {number} index 移除的开始位置
         * @param {number} length 移除的数量
         */
        removeGroups: function (index, length) {
            var helper = this.helper;
            helper.removeItems(index, length);
        },

        /**
         * 选中索引值为 index 的列表项
         *
         * @param {number} index
         * @return {Item} 选中的列表项
         */
        selectItemByIndex: function (index) {
            return this.helper.selectItemByIndex(index);
        },

        /**
         * 选中 `value` 字段为 value 的列表项
         *
         * @param {string} value
         * @return {Item} 选中的列表项
         */
        selectItemByValue: function (value) {
            var index = getIndexByValue(this.datasource, value);
            if (index !== -1) {
                return this.selectItemByIndex(index);
            }
        },

        /**
         * 取消选中索引值为 index 的列表项
         *
         * @param {number} index 索引值
         */
        deselectItemByIndex: function (index) {
            var item = this.helper.items[index];
            if (item) {
                item.setProperties({
                    selected: false
                });
            }
        },

        /**
         * 取消选中`value`字段为 value 的列表项
         *
         * @param {string} value
         */
        deselectItemByValue: function (value) {
            var index = getIndexByValue(this.datasource, value);
            if (index !== -1) {
                this.deselectItemByIndex(index);
            }
        },

        /**
         * 获得选中的列表项数据
         *
         * @return {Array}
         */
        getSelectedItems: function () {
            return this.helper.getSelectedItems(true);
        },

        /**
         * 清空列表
         */
        clear: function () {
            this.setProperties({
                datasource: [ ]
            });
        }
    };

    /**
     * 列表控件的默认参数
     *
     * @static
     * @type {Object}
     */
    List.defaultOptions = {

        datasource: [],

        // 不可多选
        multiple: false,

        // 开启 toggle 反选
        toggle: true,

        // 超长是否截断处理
        overflow: false,

        defaultText: '',
        emptyText: '',
        loadingText: '',

        groupHeaderTemplate: function (group) {
            return group.name || group.text;
        },

        itemTemplate: function (data) {
            if (typeof data === 'string') {
                return data;
            }
            return data.name || data.text;
        }
    };

    List.painters = [

        {
            name: 'datasource',
            painter: function (list, datasource) {

                var main = list.main;
                var scrollPanel = list.scrollPanel;

                if (datasource.length === 0) {

                    var isInited = list.stage === lib.LifeCycle.INITED;

                    if (isInited) {
                        scrollPanel.setContent(list.defaultText);
                        main.addClass(List.CLASS_DEFAULT);
                    }
                    else {
                        scrollPanel.setContent(list.emptyText);
                        main.addClass(List.CLASS_EMPTY);
                    }
                }
                else {

                    main.removeClass(List.CLASS_DEFAULT);
                    main.removeClass(List.CLASS_EMPTY);
                    main.removeClass(List.CLASS_LOADING);

                    var helper = list.helper;
                    helper.raw = null;

                    helper.stopThreads();
                    helper.setProperties({
                        raw: datasource
                    });
                }
            }
        },

        {
            name: ['height', 'maxHeight'],
            painter: function (list, height, maxHeight) {
                list.scrollPanel.setProperties({
                    height: height,
                    maxHeight: maxHeight
                });
            }
        },

        {
            name: 'overflow',
            painter: function (list, newValue, oldValue) {
                var main = list.main;
                if (newValue) {
                    main.attr('overflow', 'overflow');
                }
                else if (oldValue) {
                    main.removeAttr('overflow');
                }
            }
        }

    ];

    var classPrefix = gui.config.uiClassPrefix + '-list-';

    /**
     * 列表初始化完成且未填充数据状态的 class
     *
     * @static
     * @type {string}
     */
    List.CLASS_DEFAULT = classPrefix + 'default';

    /**
     * 列表正在加载状态的 class
     *
     * @static
     * @type {string}
     */
    List.CLASS_LOADING = classPrefix + 'loading';

    /**
     * 列表填充空数据的 class
     *
     * @static
     * @type {string}
     */
    List.CLASS_EMPTY = classPrefix + 'empty';


    /**
     * 统一处理 click 事件
     */
    function onclick(e) {
        var group = e.group;
        var item = e.item;

        if (item) {
            clickItem.apply(this, arguments);
        }
        else if (group) {
            clickGroup.apply(this, arguments);
        }
    }

    /**
     * 统一处理 mouseenter 事件
     */
    function onmouseover(e) {
        var group = e.group;
        var item = e.item;

        if (item) {
            enterItem.apply(this, arguments);
        }
        else if (group) {
            enterGroup.apply(this, arguments);
        }
    }

    /**
     * 统一处理 mouseleave 事件
     */
    function onmouseout(e) {
        var group = e.group;
        var item = e.item;

        if (item) {
            leaveItem.apply(this, arguments);
        }
        else if (group) {
            leaveGroup.apply(this, arguments);
        }
    }

    /**
     * 点击 item 的事件处理函数
     *
     * @private
     * @param {Object} e 事件对象
     * @param {Item} e.item item 对象
     */
    function clickItem(e) {

        var item = e.item;
        var group = e.group || this.helper;

        var selected = item.selected;

        if (this.toggle) {
            selected = !selected;
        }
        else {
            selected = !selected ? true : null;
        }

        // 修改选中状态
        if (typeof selected === 'boolean') {
            if (selected) {
                group.selectItemByIndex(item.index);
            }
            else {
                item.setProperties({
                    selected: false
                });
            }
        }

        this.trigger(
            'clickitem',
            {
                item: item
            }
        );
    }


    /**
     * 鼠标进入 item 的事件处理函数
     *
     * @private
     * @param {Object} e 事件对象
     * @param {Item} e.item item 对象
     */
    function enterItem(e) {
        this.trigger('enteritem',
            {
                item: e.item,
                group: e.group || this.helper
            }
        );
    }

    /**
     * 鼠标离开 item 的事件处理函数
     *
     * @private
     * @param {Object} e 事件对象
     * @param {Item} e.item item 对象
     */
    function leaveItem(e) {
        this.trigger('leaveitem',
            {
                item: e.item,
                group: e.group || this.helper
            }
        );
    }

    /**
     * 点击列表分组头部 [header] 的事件处理函数
     *
     * @private
     * @param {Object} e 事件对象
     * @param {Collection} e.group 分组对象
     */
    function clickGroup(e) {
        var group = e.group;
        var selected = group.selected;

        if (group.toggle) {
            selected = !selected;
        }
        else {
            selected = !selected ? true : null;
        }

        if (typeof selected === 'boolean') {
            group.setProperties({
                selected: selected
            });
        }

        this.trigger('clickgroup',
            {
                group: group
            }
        );
    }

    /**
     * 鼠标进入列表分组头部 [header] 的事件处理函数
     *
     * @private
     * @param {Object} e 事件对象
     * @param {Collection} e.group 分组对象
     */
    function enterGroup(e) {
        this.trigger('entergroup',
            {
                group: e.group
            }
        );
    }

    /**
     * 鼠标离开列表分组头部 [header] 的事件处理函数
     *
     * @private
     * @param {Object} e 事件对象
     * @param {Collection} e.group 分组对象
     */
    function leaveGroup(e) {
        this.trigger('leavegroup',
            {
                group: e.group
            }
        );
    }

    /**
     * 销毁控件
     */
    function beforeDispose() {
        this.helper.dispose();
    }


    /**
     * 获得 value 值在 datasource 中的索引
     *
     * @private
     * @param {Array} datasource
     * @param {string} value
     * @return {number}
     */
    function getIndexByValue(datasource, value) {

        var index = -1;
        var item;

        for (var i = 0, len = datasource.length; i < len; i++) {
            item = datasource[i];

            if (typeof item === 'string') {
                if (item === value) {
                    index = i;
                    break;
                }
            }
            else if (item.value === value) {
                index = i
                break;
            }
        }

        return index;
    }

    lib.inherits(List, SuperClass);


    return List;

});
