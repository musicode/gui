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
     * @param {number=} options.height
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
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            var me = this;
            var main = this.main;

            main.html(this.template);

            // 容器可能设置过 padding-top 和 padding-bottom
            var viewport = this.getViewport();
            viewport.css({
                top: main.css('padding-top'),
                bottom: main.css('padding-bottom')
            });

            this.wheelScrollOptions = {
                element: main,
                isOutside: function () {
                    return me.scrollY <= me.minY
                        || me.scrollY >= me.maxY;
                }
            };

            var scrollbar = this.getScrollBar();
            this.draggableOptions = {
                element: scrollbar.find('.' + ScrollPanel.CLASS_SCROLLTHUMB),
                containment: scrollbar,
                axis: 'y',
                silence: true
            };

            this.on('dragging', scrollByDrag);
            this.on('wheelScroll', scrollByWheel);
            this.on('propertyChange', changeContent);

            SuperClass.prototype.initStructure.apply(this, arguments);
        },

        /**
         * 获得滚动面板的内容
         *
         * @return {string}
         */
        getContent: function () {
            return this.content;
        },

        /**
         * 设置滚动面板的内容
         *
         * @param {string} content
         */
        setContent: function (content) {
            this.setProperties({
                content: content
            });
        },

        /**
         * 获得可视区域
         *
         * @return {jQuery}
         */
        getViewport: function () {
            return this.main.find('.' + ScrollPanel.CLASS_VIEWPORT);
        },

        /**
         * 获得内容区域
         *
         * @return {jQuery}
         */
        getContentArea: function () {
            return this.main.find('.' + ScrollPanel.CLASS_CONTENT);
        },

        /**
         * 获得滚动条
         *
         * @type {jQuery}
         */
        getScrollBar: function () {
            return this.main.find('.' + ScrollPanel.CLASS_SCROLLBAR);
        },

        /**
         * 获得可视高度
         *
         * @return {number}
         */
        getViewportHeight: function () {
            return lib.getHeight(this.main, this.getViewport());
        },

        /**
         * 获得可滚动高度
         *
         * @return {number}
         */
        getScrollHeight: function () {
            return lib.getHeight(this.main, this.getContentArea());
        },

        /**
         * 是否出现了滚动条
         *
         * @return {boolean}
         */
        hasScrollbar: function () {
            return this.getScrollHeight() > this.getViewportHeight();
        }
    };

    var classPrefix = gui.config.uiClassPrefix + '-scrollpanel-';

    ScrollPanel.CLASS_VIEWPORT = classPrefix + 'viewport';
    ScrollPanel.CLASS_CONTENT = classPrefix + 'content';
    ScrollPanel.CLASS_SCROLLBAR = classPrefix + 'scrollbar';
    ScrollPanel.CLASS_SCROLLTHUMB = classPrefix + 'scrollthumb';

    ScrollPanel.defaultOptions = {
        scrollY: 0,
        template: '<div class="' + ScrollPanel.CLASS_VIEWPORT + '">'
                +     '<div class="' + ScrollPanel.CLASS_CONTENT + '"></div>'
                + '</div>'
                + '<div class="' + ScrollPanel.CLASS_SCROLLBAR + '">'
                +     '<div class="' + ScrollPanel.CLASS_SCROLLTHUMB + '"></div>'
                + '</div>'
    };

    ScrollPanel.painters = [

        {
            name: 'content',
            painter: function (scrollPanel, content) {
                var element = scrollPanel.getContentArea();
                element.html(content);
            }
        },

        {
            name: 'height',
            painter: function (scrollPanel, height) {
                setHeight(scrollPanel, height);
            }
        },

        {
            name: 'scrollY',
            check: function (scrollPanel, y) {

                var ratio = scrollPanel.ratio;
                var temp = y / ratio;

                if (temp < scrollPanel.minY) {
                    y = ratio * scrollPanel.minY;
                }
                else if (temp > scrollPanel.maxY) {
                    y = ratio * scrollPanel.maxY;
                }
                return y;
            },
            painter: function (scrollPanel, y) {

                var thumb = scrollPanel.draggableOptions.element;
                thumb.css({
                    top: y / scrollPanel.ratio
                });

                var contentPanel = scrollPanel.getContentArea();
                contentPanel.css({
                    top: -1 * y
                });

            }
        }
    ];

    /**
     * 因为 ScrollPanel.paints 和 contentChange 都需要设置高度
     * 因此把此方法提出来，便于直接调用
     *
     * @param {ScrollPanel} scrollPanel
     * @param {number} height
     */
    function setHeight(scrollPanel, height) {
        var map = lib.array2Object(SuperClass.painters, 'name');
        map.height.painter(scrollPanel, height);

        var viewport = scrollPanel.getViewport();
        var content = scrollPanel.getContentArea();

        if ($.isNumeric(height)) {
            viewport.css('position', 'absolute');
            content.css('position', 'absolute');
        }
        else {
            viewport.css('position', 'static');
            content.css('position', 'static');
        }
        refreshScrollbar(scrollPanel);
    }

    /**
     * 根据内容和容器刷新滚动条
     */
    function refreshScrollbar(scrollPanel) {

        var viewport = scrollPanel.getViewport();
        var viewportHeight = scrollPanel.getViewportHeight();
        var contentHeight = scrollPanel.getScrollHeight();

        var ratio = contentHeight > 0 ? viewportHeight / contentHeight : 1;

        var scrollBar = scrollPanel.getScrollBar();
        var scrollThumb = scrollPanel.draggableOptions.element;

        if (ratio < 1) {
            scrollBar.show();
            scrollThumb.height(ratio * 100 + '%');

            draggable.enable(scrollPanel.draggableOptions);
            wheelscroll.enable(scrollPanel.wheelScrollOptions);
            viewport.css({ right: gui.config.scrollbarWidth });
        }
        else {
            scrollBar.hide();
            draggable.disable(scrollPanel.draggableOptions);
            wheelscroll.disable(scrollPanel.wheelScrollOptions);
            viewport.css({ right: 0 });
        }

        var scrollBarHeight = scrollPanel.getHeight();
        var scrollThumbHeight = scrollBarHeight * ratio;

        // ratio 用来转换 滚动条和内容区的偏移量
        scrollPanel.ratio = contentHeight / scrollBarHeight;
        scrollPanel.minY = 0;
        scrollPanel.maxY = scrollBarHeight - scrollThumbHeight;
        p(scrollPanel.maxY)
    }

    function scrollByDrag(e, data) {
        this.setProperties({
            scrollY: data.y * this.ratio
        });
    }

    function scrollByWheel(e, data) {
        this.setProperties({
            scrollY: (this.scrollY || 0) + (data.delta * 20)
        });
    }

    function changeContent(e, data) {
        if (data && data.content != null) {

            var height = height != null ? height : 'auto';
            if (this.maxHeight) {
                if (this.getScrollHeight() > this.maxHeight) {
                    height = this.maxHeight;
                }
            }
            setHeight(this, height);

            refreshScrollbar(this);
        }
    }

    lib.inherits(ScrollPanel, SuperClass);

    return ScrollPanel;

});
