/**
 * @file ComboBox
 * @author zhujl
 */
define(function (require) {

    'use strict';

    var SuperClass = require('./interface/Control');
    var Button = require('./Button');
    var List = require('./List');

    var popup = require('./lib/popup');
    var lib = require('./lib/lib');
    var gui = require('./main');

    /**
     * 下拉选项按钮
     *
     * @constructor
     * @param {Object} options
     * @param {Array} options.datasource
     * @param {numbe=} options.selectedIndex 选中的索引
     * @param {string=} options.value 选中的值
     *                                如果同时传入了 selectedIndex 和 value
     *                                以 value 为准
     *
     * @param {boolean=} options.hidden
     * @param {boolean=} options.disabled
     *
     * @param {string=} options.emptyText 没有选中列表项时的提示文本
     *
     * @param {number=} options.width button 的宽度
     *                                list 的宽度取决于 overflow 配置
     *
     * @param {number=} options.height button 的高度
     *
     * @param {number=} optioins.maxHeight list 的最大高度
     *
     * @param {boolean=} options.overflow 列表字数超长是否截断处理
     *                                    如果截断，宽度和 button 相同
     *                                    如果不截断，宽度取决于最长的列表项
     */
    function ComboBox(options) {
        SuperClass.apply(this, arguments);
    }

    ComboBox.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'ComboBox',

        /**
         * 初始化控件参数
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {

            // 两者皆有时，以 value 为准
            if (options.selectedIndex != null
                && options.value != null
            ) {
                delete options.selectedIndex;
            }

            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化控件的 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            SuperClass.prototype.initStructure.apply(this, arguments);

            var main = this.main;
            main.html(this.template);

            var button = new Button({
                main: main.find('.' + buttonClass),
                labelPlacement: 'left',
                icon: lib.createElement('<span class="i-caret"></span>')
            });
            button.render();

            var list = new List({
                main: main.find('.' + listClass),
                hidden: true,
                toggle: false
            });
            list.render();

            this.popupOptions = {
                trigger: button.main,
                element: list.main,
                showBy: 'click',
                hideBy: 'blur',
                show: function () {
                    list.show();
                },
                hide: function() {
                    list.hide();
                }
            };
            popup.enable(this.popupOptions);

            /**
             * 触发下拉行为的按钮
             *
             * @type {ui.Button}
             */
            this.button = button;

            /**
             * 下拉列表
             *
             * @type {ui.List}
             */
            this.list = list;

            list.on('click', clickItem, this);
            list.on('aftershow', afterListShow, this);
            list.on('afterhide', afterListHide, this);

            this.one('beforedispose', beforeDispose);
        },

        /**
         * 获取选中的值
         *
         * @return {string}
         */
        getValue: function () {
            return this.value;
        },

        /**
         * 设置选中值
         *
         * @param {string} value
         */
        setValue: function (value) {
            this.setProperties({
                value: value
            });
        }
    };

    var classPrefix = gui.config.uiClassPrefix + '-';

    var buttonClass = classPrefix + 'button';
    var listClass = classPrefix + 'list';

    /**
     * 默认配置
     *
     * @type {Object}
     */
    ComboBox.defaultOptions = {
        emptyText: '',
        width: 100,
        selectedIndex: -1,
        template: '<button class="' + buttonClass + '"></button>'
                + '<div class="' + listClass + '"></div>'
    };

    ComboBox.painters = [

        {
            name: 'datasource',
            painter: function (combobox, datasource) {

                combobox.list.setProperties({
                    datasource: datasource
                });

                combobox.selectedIndex = -1;
                combobox.value = null;
            }
        },

        {
            name: 'overflow',
            painter: function (combobox, overflow) {
                var list = combobox.list;

                list.setProperties({
                    overflow: overflow
                });
            }
        },

        {
            name: 'height',
            painter: function (combobox, height) {

                var button = combobox.button;
                var list = combobox.list;

                button.setProperties({
                    height: height
                });

                list.main.css({ top: height + 1 });
            }
        },

        {
            name: 'maxHeight',
            painter: function (combobox, maxHeight) {
                var list = combobox.list;
                list.setProperties({
                    maxHeight: maxHeight
                });
            }
        },

        {
            name: 'disabled',
            painter: function (combobox, disabled) {
                var button = combobox.button;
                button.setProperties({
                    disabled: disabled
                });
            }
        },

        {
            name: 'emptyText',
            painter: function (combobox, emptyText) {
                // 只有当前没选中才需要改 DOM
                if (combobox.selectedIndex === -1) {
                    combobox.button.setLabel(emptyText);
                }
            }
        },

        {
            name: 'selectedIndex',
            painter: function (combobox, selectedIndex) {
                selectItem(combobox, selectedIndex);
            }
        },

        {
            name: 'value',
            painter: function (combobox, value) {

                var datasource = combobox.datasource;

                for (var i = 0, len = datasource.length; i < len; i++) {

                    var item = datasource[i];
                    var itemValue = $.isPlainObject(item) ? item.value : item;

                    if (itemValue == value) {
                        selectItem(combobox, i);
                        break;
                    }
                }
            }
        }
    ];

    function afterListShow() {
        var button = this.button;
        button.setProperties({
            selected: true
        });
    }

    function afterListHide() {
        var button = this.button;
        button.setProperties({
            selected: false
        });
    }

    function beforeDispose() {
        this.button.dispose();
        this.list.dispose();
    }

    /**
     * 点击列表项的事件处理函数
     *
     * @inner
     * @param {Object} e 事件对象
     */
    function clickItem(e) {
        var item = e.item;
        if (item) {
            this.list.hide();
            selectItem(this, item);
        }
    }

    /**
     * 选中列表项有两种来源：
     * 1. combobox.setProperties({ selectedIndex: 1 });
     * 2. 点击打开的列表项
     *
     * 1 的动作流: 选中列表项 设置按钮文本
     * 2 的动作流：改变 selectedIndex/value，设置按钮文本
     *
     * @param {ui.ComboBox} comboBox
     * @param {number|Item} item
     */
    function selectItem(comboBox, item) {

        if (typeof item === 'number') {
            var index = item;
            var list = comboBox.list;

            item = list.selectItemByIndex(index);
        }

        var text;

        // 同步值
        if (item) {
            var data = item.raw;
            var value;

            if ($.isPlainObject(data)) {
                text = data.name || data.text;
                value = data.value;
            }
            else {
                text = data;
                value = data;
            }

            comboBox.selectedIndex = item.index;
            comboBox.value = value;
        }

        // 设置按钮文本
        comboBox.button.setLabel(text || comboBox.emptyText);

        /**
         * @event ComboBox#ui-change
         */
        comboBox.trigger('ui-change');
    }


    lib.inherits(ComboBox, SuperClass);


    return ComboBox;

});

