/**
 * @class ScrollPanel
 * @author zhujl
 */
define(function (require) {

    'use strict';

    var SuperClass = require('./interface/Control');

    var draggable = require('./lib/draggable');
    var wheelscroll = require('./lib/wheelscroll');
    var lib = require('./lib/lib');
    var gui = require('./main');

    /**
     * 可滚动面板
     *
     * @constructor
     * @param {Object} options
     * @param {string} options.content
     * @param {number=} options.scrollY
     */
    function ScrollPanel(options) {
        SuperClass.apply(this, arguments);
    }

    ScrollPanel.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'ScrollPanel',

        /**
         * 初始化控件配置
         * 
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            if (typeof options.content !== 'string') {
                options.content = this.main.html();
            }
            lib.supply(options, ScrollPanel.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {
            this.main.html(this.template);

            this.on('dragging', scrollByDrag);
            this.on('wheelscroll', scrollByWheel);

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
         * 获得可滚动高度
         * 
         * @return {number}
         */
        getScrollHeight: function () {
            return this.main.find('.' + ScrollPanel.CLASS_CONTENT)[0].offsetHeight;
        }
    };

    var classPrefix = gui.config.uiClassPrefix + '-scrollpanel-';

    ScrollPanel.CLASS_CONTENT = classPrefix + 'content';
    ScrollPanel.CLASS_SCROLLBAR = classPrefix + 'scrollbar';
    ScrollPanel.CLASS_SCROLLTHUMB = classPrefix + 'scrollthumb';

    ScrollPanel.defaultOptions = {
        scrollY: 0,
        template: '<div class="' + ScrollPanel.CLASS_CONTENT + '"></div>'
                + '<div class="' + ScrollPanel.CLASS_SCROLLBAR + '">'
                + '<div class="' + ScrollPanel.CLASS_SCROLLTHUMB + '"></div>'
                + '</div>'
    };

    ScrollPanel.painter = {

        height: function (scrollPanel, height) {
            SuperClass.painter.height(scrollPanel, height);
            refreshScrollbar(scrollPanel);
        },

        content: function (scrollPanel, content) {
            var element = scrollPanel.main.find('.' + ScrollPanel.CLASS_CONTENT);
            element.html(content);

            refreshScrollbar(scrollPanel);
        },

        scrollY: function (scrollPanel, y, oldY) {
            if (y < scrollPanel.minY) {
                y = scrollPanel.minY;
            }
            else if (y > scrollPanel.maxY) {
                y = scrollPanel.maxY;
            }

            if (y === oldY) {
                return;
            }

            y *= -1;

            var contentPanel = scrollPanel.main.find('.' + ScrollPanel.CLASS_CONTENT);
            contentPanel.css({
                top: y
            });

            var thumb = scrollPanel.main.find('.' + ScrollPanel.CLASS_SCROLLTHUMB);
            thumb.css({
                top: -1 * y * scrollPanel.ratio
            });
        }
    };

    /**
     * 计算 scroll thumb 的高度
     * 此高度需参考内容和容器高度
     * 
     * @return {number}
     */
    function getRatio(scrollPanel) {
        var containerHeight = scrollPanel.getHeight();
        var contentHeight = scrollPanel.getScrollHeight();

        if (contentHeight > 0) {
            return containerHeight / contentHeight;
        }
        else {
            return 0;
        }
    }


    /**
     * 根据内容和容器刷新滚动条
     */
    function refreshScrollbar(scrollPanel) {
        var main = scrollPanel.main;
        var content = main.find('.' + ScrollPanel.CLASS_CONTENT);
        var thumb = main.find('.' + ScrollPanel.CLASS_SCROLLTHUMB);
        var height = scrollPanel.getHeight();
        var ratio = getRatio(scrollPanel);

        if (ratio < 1) {
            thumb.show();
            thumb.height(Math.round(height * ratio));

            draggable.enable({
                element: thumb,
                containment: thumb.parent(),
                axis: 'y',
                silence: true
            });
            wheelscroll.enable(main);
            content.css({ right: thumb.width() });
        }
        else {
            thumb.hide();
            draggable.disable(thumb);
            wheelscroll.disable(main);
            content.css({ right: 0 });
        }

        scrollPanel.ratio = ratio;
        scrollPanel.minY = 0;
        scrollPanel.maxY = Math.max(0, content.height() - height);
    }

    function scrollByDrag(e, data) {
        this.setProperties({
            scrollY: data.y / this.ratio
        });
    }

    function scrollByWheel(e, data) {
        p(data.delta);
        this.setProperties({
            scrollY: this.scrollY + (data.delta * 20)
        });
    }

    lib.inherits(ScrollPanel, SuperClass);

    return ScrollPanel;

});
