/**
 * @file Carousel
 * @author zhujl
 */
define(function (require) {

    'use strict';

    var SuperClass = require('./interface/Control');
    var lib = require('./lib/lib');

    /**
     * 轮播
     *
     * 此控件无法具体实现, 需求不同 HTML 结构可能很不一样, 无法固定一套模版
     * 但是, 此类控件必须有三个基础部分:
     * 1. viewport
     * 2. 上一页 下一页
     * 3. 页码按钮
     *
     * @constructor
     * @param {Object} options
     * @param {(HTMLElement | jQuery)=} options.main 主元素
     * @param {number=} options.page 当前展现第几页, 从 0 开始
     */
    function Carousel(options) {
        SuperClass.apply(this, arguments);
    }

    Carousel.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'Carousel',

        /**
         * 初始化控件配置
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, Carousel.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化 DOM 结构和事件
         *
         * @protected
         * @override
         */
        initStructure: function () {

            var prev = '*[data-role="' + Carousel.role.prev + '"]';
            var next = '*[data-role="' + Carousel.role.next + '"]';

            this.on('click', prev, prevPage);
            this.on('click', next, nextPage);

            SuperClass.prototype.initStructure.apply(this, arguments);
        },

        /**
         * 创建主元素
         *
         * @protected
         * @override
         * @param {Object} options
         * @return {HTMLElement}
         */
        createMain: function (options) {
            return document.createElement('div');
        }
    };

    /**
     * 默认配置
     *
     * @type {Object}
     */
    Carousel.defaultOptions = {
        page: 0
    };

    Carousel.painter = {
        page: function (carousel, page) {

            var role = Carousel.role;
            var viewport = '*[data-role="' + role.viewport + '"]';
            var viewportWrapper = '*[data-role="' + role.viewportWrapper + '"]';

            var main = carousel.main;
            viewport = main.find(viewport);
            viewportWrapper = main.find(viewportWrapper);

            var pageWidth = viewport.outerWidth();

            var from = parseFloat(viewportWrapper.css('left'), 10);
            var to = -1 * page * pageWidth;

            if (to !== from) {
                carousel.trigger('ui-change');

                viewportWrapper.animate({
                    left: to
                }, 300);
            }

        }
    };

    /**
     * 模板里的 data-role 值
     * 暴露出去便于外部修改
     */
    Carousel.role = {
        viewport: 'viewport',
        viewportWrapper: 'viewport-wrapper',
        prev: 'prev',
        next: 'next'
    };


    function prevPage() {
        this.setProperties({
            page: this.page - 1
        });
    }

    function nextPage() {
        this.setProperties({
            page: this.page + 1
        });
    }

    lib.inherits(Carousel, SuperClass);


    return Carousel;

});
