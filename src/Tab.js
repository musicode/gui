/**
 * @file Tab
 * @author zhujl
 */
define(function (require) {

    'use strict';

    var SuperClass = require('./interface/Control');
    var lib = require('./lib/lib');
    var gui = require('./main');

    /**
     * 标签页
     *
     * @constructor
     * @param {Object} options
     * @param {number=} options.width
     * @param {number} options.selectedIndex 默认选中的 tab
     * @param {Array} options.datasource 格式如下：
     *                                 [
     *                                   {
     *                                     id: '可选',
     *                                     title: '',
     *                                     content: ''
     *                                   }, ...
     *                                 ]
     */
    function Tab(options) {
        SuperClass.apply(this, arguments);
    }

    Tab.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'Tab',

        /**
         * 初始化控件参数
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, Tab.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化控件 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            var main = this.main;
            var html = '<div class="' + Tab.CLASS_NAV + '"></div>'
                     + '<div class="' + Tab.CLASS_CONTENT + '"></div>';

            main.html(html);

            this.on('click', '.' + Tab.CLASS_NAV + ' li', onclick);
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

    Tab.defaultOptions = {
        datasource: [ ],
        selectedIndex: 0
    };

    Tab.painter = {

        datasource: function (tab, datasource) {

            var navHTML = '';
            var contentHTML = '';

            $.each(datasource, function (index, item) {

                var aExtra = item.id ? ' href="#' + item.id + '"' : '';
                var divExtra = item.id ? ' id="' + item.id + '"' : '';

                navHTML += '<li><a' + aExtra + '>' + item.title + '</a></li>';
                contentHTML += '<div class="' + Tab.CLASS_PANEL + '"' + divExtra + '>'
                             + item.content
                             + '</div>';
            });

            navHTML = '<ul>' + navHTML + '</ul>';

            var nav = $('.' + Tab.CLASS_NAV, tab.main);
            nav.html(navHTML);
            nav.next().html(contentHTML);
        },

        selectedIndex: function (tab, currentIndex, prevIndex) {

            var nav = $('.' + Tab.CLASS_NAV, tab.main);
            var content = nav.next();
            var activeClass = gui.CLASS.ACTIVE;
            var panelSelector = '.' + Tab.CLASS_PANEL;

            if (prevIndex != null) {
                // 取消上次选中的
                nav.find('li:eq(' + prevIndex + ')').removeClass(activeClass);
                content.find(panelSelector + ':eq(' + prevIndex + ')').removeClass(activeClass);
            }

            nav.find('li:eq(' + currentIndex + ')').addClass(activeClass);
            content.find(panelSelector + ':eq(' + currentIndex + ')').addClass(activeClass);
        }
    };

    /**
     * 切换 tab 的事件处理函数
     *
     * @private
     * @param {Object} e 事件对象
     */
    function onclick(e) {
        e.preventDefault();

        var li = e.currentTarget;

        this.setProperties({
            selectedIndex: lib.getElementIndex(li)
        });

        this.trigger('select');
    }

    var classPrefix = gui.config.uiClassPrefix + '-tab-';

    /**
     * 导航栏 class
     *
     * @static
     * @type {string}
     */
    Tab.CLASS_NAV = classPrefix + 'nav';

    /**
     * 内容区 class
     *
     * @static
     * @type {string}
     */
    Tab.CLASS_CONTENT = classPrefix + 'content';

    /**
     * 切换面板 class
     *
     * @static
     * @type {string}
     */
    Tab.CLASS_PANEL = classPrefix + 'panel';


    lib.inherits(Tab, SuperClass);


    return Tab;

});
