/**
 * @file Collection
 * @author zhujl
 */
define(function (require) {

    'use strict';
    
    var Item = require('./Item');
    var Thread = require('./Thread');
    var lib = require('./lib');
    var gui = require('../main');

    /**
     * 集合类
     *
     * 主要解决的问题是：
     * 1. 大数据时，异步创建 DOM 元素，提升用户体验
     * 2. 管理分组
     *
     * @constructor
     * @param {Object} options
     * @param {HTMLElement} options.main 主元素
     * @param {Array} options.raw 集合的原始数据
     * @param {boolean} options.selected 是否全选
     * @param {boolean} options.multiple 是否可多选
     * @param {boolean=} options.async 是否异步创建
     * @param {number=} options.asyncStep 异步间隔时长
     * @param {Function} options.insertStepHandler 插入时每个时间片执行的函数
     * @param {Function} options.insertCompleteHandler 插入结束时执行的函数
     * @param {Function} options.removeStepHandler 移除时每个时间片执行的函数
     * @param {Function} options.removeCompleteHandler 移除结束时执行的函数
     * @param {Function} options.selectStepHandler 选中时每个时间片执行的函数
     * @param {Function} options.selectCompleteHandler 选中结束时执行的函数
     * @param {Function=} options.itemTemplate 自定义集合项结构
     * @param {Function=} options.groupHeaderTemplate 自定义分组结构
     */
    function Collection(options) {
        Item.apply(this, arguments);
    }

    Collection.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'Collection',

        /**
         * 初始化参数
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, Collection.defaultOptions);
            Item.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            this.items = [ ];

            var Class = this.constructor;

            if (!this.main.hasClass(Class.CLASS_GROUP)) {
                var groupClass = '.' + Class.CLASS_GROUP;
                var itemClass = '.' + Class.ItemClass.CLASS_ITEM;

                this.on('click', groupClass, clickGroup);
                this.on('mouseover', groupClass, enterGroup);
                this.on('mouseout', groupClass, leaveGroup);

                this.on('click', itemClass, clickItem);
                this.on('mouseenter', itemClass, enterItem);
                this.on('mouseleave', itemClass, leaveItem);
            }
            else {
                this.on('beforedispose', beforeDispose);
            }

        },

        /**
         * 创建主元素
         * 当 Collection 作为分组项时，才会需要动态创建
         *
         * @protected
         * @param {Object=} options
         * @return {HTMLElement}
         */
        createMain: function (options) {

            var Class = this.constructor;
            var attr = '';

            if (options.selected) {
                attr = ' selected="selected"';
            }

            // group header 可自定义
            var header;
            var groupHeaderTemplate = options.groupHeaderTemplate;
            if (typeof groupHeaderTemplate === 'function') {
                header = groupHeaderTemplate(options.raw);
            }
            else {
                header = options.raw.text || '';
            }

            var html = '<div class="' + Class.CLASS_GROUP + '"' + attr + '>'
                     +     '<div class="' + Class.CLASS_GROUP_HEADER + '">' + header + '</div>'
                     +     '<div class="' + Class.CLASS_GROUP_BODY + '"></div>'
                     + '</div>';

            return lib.createElement(html);
        },

        /**
         * 插入集合项
         *
         * @param {number} index 插入的位置
         * @param {Array} data 插入的数据
         */
        insertItems: function (index, data) {

            var me = this;
            var Class = this.constructor;

            // 格式化数据
            var items = Class.create(
                index,
                data,
                function (options) {
                    options.multiple = me.multiple;
                    options.async = me.async;
                    options.asyncStep = me.asyncStep;
                    options.itemTemplate = me.itemTemplate;
                    options.groupHeaderTemplate = me.groupHeaderTemplate;
                }
            );

            var setElement;

            // 确定容器元素
            var container = this.getItemContainer();

            if (index >= this.items.length) {
                $.merge(this.items, items);

                setElement = function (element) {
                    container.appendChild(element);
                };
            }
            else {
                lib.splice(this.items, index, 0, items);

                var next = container.children[index];
                setElement = function (element) {
                    container.insertBefore(element, next);
                };
            }

            this.startInsertThread(items, {
                setElement: setElement
            });
        },

        /**
         * 移除集合项
         *
         * @param {number} startIndex 开始移除的位置
         * @param {number} length 移除的数量
         */
        removeItems: function (startIndex, length) {

            // 删除数据
            var items = this.items.splice(startIndex, length);

            this.startRemoveThread(items);
        },

        /**
         * 选中第 index 项
         *
         * @param {number} index
         * @return {Item}
         */
        selectItemByIndex: function (index) {

            var item = this.items[index];
            if (!item) {
                return;
            }

            if (!this.multiple) {
                // 单选需要先把之前选中的干掉
                var selectedItems = this.getSelectedItems();
                $.each(selectedItems, function (index, item) {
                    item.setProperties({
                        selected: false
                    });
                });
            }

            item.setProperties({
                selected: true
            });

            return item;
        },

        /**
         * 获得选中的集合项
         * 注意：不支持分组集合
         *
         * @param {boolean=} raw 是否需要原始的数据
         * @return {Array}
         */
        getSelectedItems: function (raw) {

            var array = $.grep(this.items, function (item) {
                return item.selected;
            });

            if (raw) {
                array = $.map(array, function (item) {
                    return item.raw;
                });
            }

            return array;
        },

        /**
         * 获得集合项的容器元素
         *
         * @protected
         * @return {HTMLElement}
         */
        getItemContainer: function () {
            var Class = this.constructor;
            var main = this.main;

            if (main.hasClass(Class.CLASS_GROUP)) {
                return main.find('.' + Class.CLASS_GROUP_BODY)[0];
            }
            else {
                return main[0];
            }
        },

        /**
         * 启动`插入`线程
         *
         * @private
         * @param {Array.<Item>} items 已格式化的数据
         * @param {Object} data
         */
        startInsertThread: function (items, data) {
            this.startThread('insert', items, data);
        },

        /**
         * 启动`移除`线程
         *
         * @private
         * @param {Array.<Item>} items 已格式化的数据
         */
        startRemoveThread: function (items) {
            this.startThread('remove', items);
        },

        /**
         * 启动`选择`线程
         *
         * @private
         * @param {Array.<Item>} items 已格式化的数据
         * @param {Object} data
         */
        startSelectThread: function (items, data) {
            this.startThread('select', items, data);
        },

        /**
         * 中止`插入`线程
         */
        stopInsertThread: function () {
            this.stopThread('insert');
        },

        /**
         * 中止`移除`线程
         */
        stopRemoveThread: function () {
            this.stopThread('remove');
        },

        /**
         * 中止`选择`线程
         */
        stopSelectThread: function () {
            this.stopThread('select');
        },

        /**
         * 启动线程
         *
         * @private
         * @param {string} type 线程类型
         * @param {Array.<Item>} items 格式化后的数据
         * @param {Object} data
         */
        startThread: function (type, items, data) {

            var thread = type === 'select'
                       ? this.selectThread
                       : this.renderThread;

            var collection = this;
            var stepHandler = this[ type + 'StepHandler' ];
            var completeHandler = this[ type + 'CompleteHandler' ];

            if (typeof stepHandler === 'function') {
                thread.on('step', function (e, params) {
                    stepHandler(params.data, data);
                });
            }

            if (typeof completeHandler === 'function') {
                thread.on('complete', function () {
                    collection.stopThread(type);
                    completeHandler(data);
                });
            }

            thread.start(items);
        },

        /**
         * 中止线程
         *
         * @private
         * @param {string} 线程类型
         */
        stopThread: function (type) {

            var thread = type === 'select'
                       ? this.selectThread
                       : this.renderThread;

            thread.stop();

            thread.off('step');
            thread.off('complete');
        },

        /**
         * 停止所有线程
         */
        stopThreads: function () {
            this.stopInsertThread();
            this.stopRemoveThread();
            this.stopSelectThread();

            var Class = this.constructor;
            var items = this.items;

            for (var i = 0, len = items.length; i < len; i++) {
                if (items[i] instanceof Class) {
                    items[i].stopThreads();
                }
            }
        }
    };

    /**
     * 默认参数
     *
     * @static
     * @type {Object}
     */
    Collection.defaultOptions = {
        async: true,
        asyncStep: 20,
        insertStepHandler: function (items, data) {

            var setElement = data.setElement;

            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                var element = item.createMain(item);

                setElement(element);

                // 延迟完善 jQuery 对象
                item.main[0] = element;
                item.render();
            }
        },
        removeStepHandler: function (items) {
            for (var i = 0, len = items.length; i < len; i++) {
                items[i].dispose();
            }
        },
        selectStepHandler: function (items, data) {
            for (var i = 0, len = items.length; i < len; i++) {
                items[i].setProperties({ selected: data.selected });
            }
        }
    };

    Collection.painter = {

        asyncStep: function (collection, asyncStep) {
            ensureThread(collection);

            collection.renderThread.interval =
            collection.selectThread.interval = collection.async ? asyncStep : 0;
        },

        raw: function (collection, raw) {

            var items = collection.items;
            if (items.length > 0) {
                $.each (items, function (index, item) {
                    item.dispose();
                });
                items.length = 0;
            }

            var element = collection.getItemContainer();
            element.innerHTML = '';

            items = raw.children ? raw.children : raw;
            collection.insertItems(0, items);
        },

        selected: function (collection, selected) {
            Item.painter.selected(collection, selected);
            collection.startSelectThread(collection.items, { selected: selected });
        }
    };

    /**
     * 确保创建了线程对象
     */
    function ensureThread(collection) {

        if (!collection.renderThead) {
            collection.renderThread = new Thread({
                                          type: Thread.TYPE_RENDER
                                      });
        }

        if (!collection.selectThread) {
            collection.selectThread = new Thread({
                                          type: Thread.TYPE_SELECT
                                      });
        }
    }


    function beforeDispose() {
        $.each(this.items, function (index, item) {
            item.dispose();
        });
        this.main.remove();
    }


    function clickGroup(e) {
        var index = lib.getElementIndex(e.currentTarget);
        var group = this.items[index];

        e.group = group;

        if (typeof e.itemIndex === 'number') {
            e.item = group.items[e.itemIndex];
        }
    }

    function enterGroup(e) {
        var index = lib.getElementIndex(e.currentTarget);
        var group = this.items[index];

        e.group = group;

        if (typeof e.itemIndex === 'number') {
            e.item = group.items[e.itemIndex];
        }
    }

    function leaveGroup(e) {
        var index = lib.getElementIndex(e.currentTarget);
        var group = this.items[index];

        e.group = group;

        if (typeof e.itemIndex === 'number') {
            e.item = group.items[e.itemIndex];
        }
    }

    /**
     * 点击 item 的事件处理函数
     *
     * @private
     * @param {Object} e 事件对象
     */
    function clickItem(e) {
        var index = lib.getElementIndex(e.currentTarget);
        var item = this.items[index];

        e.item = item;
        e.itemIndex = index;
    }

    /**
     * 鼠标进入 item 的事件处理函数
     *
     * @private
     * @param {Object} e 事件对象
     */
    function enterItem(e) {
        var index = lib.getElementIndex(e.currentTarget);
        var item = this.items[index];

        e.item = item;
        e.itemIndex = index;
    }

    /**
     * 鼠标离开 item 的事件处理函数
     *
     * @private
     * @param {Object} e 事件对象
     */
    function leaveItem(e) {
        var index = lib.getElementIndex(e.currentTarget);
        var item = this.items[index];

        e.item = item;
        e.itemIndex = index;
    }

    /**
     * 集合项
     *
     * @static
     * @type {Item}
     */
    Collection.ItemClass = Item;

    var classPrefix = gui.config.uiClassPrefix + '-collection-';

    /**
     * 分组 class
     *
     * @static
     * @type {string}
     */
    Collection.CLASS_GROUP = classPrefix + 'group';

    /**
     * 分组头部 class
     *
     * @static
     * @type {string}
     */
    Collection.CLASS_GROUP_HEADER = classPrefix + 'group-header';

    /**
     * 分组内容区 class
     *
     * @static
     * @type {string}
     */
    Collection.CLASS_GROUP_BODY = classPrefix + 'group-body';


    Collection.create = Item.create(function (data) {
        return data.children ? Collection : Collection.ItemClass;
    });


    lib.inherits(Collection, Item);

    return Collection;

});
