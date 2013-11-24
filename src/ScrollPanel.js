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

        initOptions: function (options) {
            if (typeof options.content !== 'string') {
                options.content = this.main.html();
            }
            lib.supply(options, ScrollPanel.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        initStructure: function () {
            var main = this.main;
            main.html(this.template);

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
         * 
         */
        scrollTo: function (y) {

            if (y < this.minY) {
                y = this.minY;
            }
            else if (y > this.maxY) {
                y = this.maxY;
            }

            y *= -1;

            var contentPanel = this.main.find('.' + ScrollPanel.CLASS_CONTENT);
            contentPanel.css({
                top: y
            });

            if (!arguments[1]) {
                var thumb = this.main.find('.' + ScrollPanel.CLASS_SCROLLTHUMB);
                thumb.css({
                    top: -1 * y * this.ratio
                });
            }
        }
    };

    var classPrefix = gui.config.uiClassPrefix + '-scrollpanel-';

    ScrollPanel.CLASS_CONTENT = classPrefix + 'content';
    ScrollPanel.CLASS_SCROLLBAR = classPrefix + 'scrollbar';
    ScrollPanel.CLASS_SCROLLTHUMB = classPrefix + 'scrollthumb';

    ScrollPanel.defaultOptions = {
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
        var contentHeight = scrollPanel.main.find('.' + ScrollPanel.CLASS_CONTENT).prop('scrollHeight');
        return containerHeight / contentHeight;
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
                axis: 'y'
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
        scrollPanel.maxY = content.prop('scrollHeight') - height;
    }

    function scrollByDrag(e, data) {
        this.scrollTo(data.y / this.ratio, false);
    }

    function scrollByWheel(e, data) {
        var contentPanel = this.main.find('.' + ScrollPanel.CLASS_CONTENT);
        var top = -1 * parseInt(contentPanel.css('top'), 10);

        this.scrollTo(top + (data.delta * 20));
    }

    lib.inherits(ScrollPanel, SuperClass);

    return ScrollPanel;

});
