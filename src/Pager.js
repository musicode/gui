/**
 * @class Pager
 * @author zhujl
 */
define(function (require) {

    'use strict';

    var SuperClass = require('./interface/Control');
    var lib = require('./lib/lib');
    var gui = require('./main');

    /**
     * 分页
     *
     * @constructor
     * @param {Object} options
     * @param {number} options.page 当前页码（从 1 开始）
     * @param {number} options.total 数据总数
     * @param {number} options.pageSize 每页条数
     * @param {string=} options.align 对齐方式, 可选值包括: left, center, right
     * @param {number} options.displayCount
     * @param {number} options.backCount
     * @param {string} options.backText
     * @param {number} options.forwardCount
     * @param {string} options.forwardText
     *
     * @param {boolean=} options.autoHide 是否在只有一页时自动隐藏
     */
    function Pager(options) {
        SuperClass.apply(this, arguments);
    }

    Pager.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'Pager',

        /**
         * 初始化控件参数
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, Pager.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化控件 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            createPagination(this);

            this.on('click', 'li:not([selected]):not([disabled])', onclick);

            SuperClass.prototype.initStructure.apply(this, arguments);
        },

        /**
         * 获得当前的页码
         *
         * @return {number}
         */
        getPage: function () {
            return this.page;
        },

        /**
         * 设置页码
         *
         * @param {number} page
         */
        setPage: function (page) {
            this.setProperties({
                page: page
            });
        }
    };

    Pager.defaultOptions = {
        page: 1,
        pageSize: 50,
        align: 'left',
        displayCount: 5,
        backCount: 2,
        backText: '上一页',
        forwardCount: 2,
        forwardText: '下一页',
        autoHide: true,
        omitTemplate: function () {
            return '...';
        }
    };

    Pager.painter = {
        page: function (pager, page) {
            createPagination(pager);
        },
        align: function (pager, align) {
            pager.main.css('text-align', align);
        }
    };

    var classPrefix = gui.config.uiClassPrefix + '-pager-';

    Pager.CLASS_ITEM = classPrefix + 'item';
    Pager.CLASS_OMIT = classPrefix + 'omit';
    Pager.CLASS_PREV = classPrefix + 'prev';
    Pager.CLASS_NEXT = classPrefix + 'next';

    /**
     * 创建页码
     *
     * @param {Object} options
     * @retrn {string}
     */
    function createPagination(pager) {

        var datasource = getDatasource(pager);
        var prevButton = datasource.shift();
        var nextButton = datasource.pop();

        var html = [ ];

        for (var key in datasource) {
            var item = datasource[key];
            if (item.length > 0) {
                html.push(createPagerSegment(item));
            }
        }

        var omit = '<li class="' + Pager.CLASS_OMIT + '">'
                 +     pager.omitTemplate()
                 + '</li>';
        html = html.join(omit);

        html = '<ul>'
             +     createPagerSegment(prevButton)
             +     html
             +     createPagerSegment(nextButton)
             + '</ul>';

        pager.main.html(html);
    }

    /**
     * 获得创建分页的数据源
     *
     * @param {ui.Pager} pager
     */
    function getDatasource(pager) {

        var pageSum = Math.ceil(pager.total / pager.pageSize);
        var page = pager.page;

        var displayCount = pager.displayCount;
        var backCount = pager.backCount;
        var forwardCount = pager.forwardCount;

        var halfDisplayCount = Math.floor(displayCount / 2);
        var begin = page - halfDisplayCount;
        var end = page + halfDisplayCount;
        if (begin < 1) {
            begin = 1;
            end = Math.min(begin + displayCount - 1, pageSum);
        }
        if (end > pageSum) {
            end = pageSum;
            begin = Math.max(end - displayCount + 1, 1);
        }

        // 接着判断 backCount 和 forwardCount 是否能显示完整
        if (begin - backCount > 0) {
            var backRange = {
                begin: 1,
                end: backCount
            };
        }
        else {
            begin = 1;
        }

        if (end + forwardCount < pageSum) {
            var forwardRange = {
                begin: pageSum - forwardCount + 1,
                end: pageSum
            };
        }
        else {
            end = pageSum;
        }

        var displayRange = {
            begin: begin,
            end: end
        };

        var i;

        var backArray = [ ];
        if (backRange) {
            for (i = backRange.begin; i <= backRange.end; i++) {
                backArray.push({
                    text: i,
                    value: i,
                    selected: i === page
                });
            }
        }

        var forwardArray = [ ];
        if (forwardRange) {
            for (i = forwardRange.begin; i <= forwardRange.end; i++) {
                forwardArray.push({
                    text: i,
                    value: i,
                    selected: i === page
                });
            }
        }

        var displayArray = [ ];
        for (i = displayRange.begin; i <= displayRange.end; i++) {
            displayArray.push({
                text: i,
                value: i,
                selected: i === page
            });
        }

        return [
            [{
                text: pager.backText,
                value: page - 1,
                disabled: page === 1
            }],

            backArray,
            displayArray,
            forwardArray,

            [{
                text: pager.forwardText,
                value: page + 1,
                disabled: page === pageSum
            }]
        ];
    }

    /**
     * 创建分页片段
     */
    function createPagerSegment(datasource) {
        var html = '';

        $.each(datasource, function (index, item) {
            var className = [ Pager.CLASS_ITEM ];
            var attrs = 'data-page="' + item.value + '"';

            if (item.selected) {
                attrs += ' selected="selected"';
            }
            if (item.disabled) {
                attrs += ' disabled="disabled"';
            }

            html += '<li class="' + Pager.CLASS_ITEM + '" ' + attrs + '>'
                  +     item.text
                  + '</li>';
        });

        return html;
    }

    function onclick(e) {
        var target = $(e.target);
        var page = target.data('page');

        if (page) {

            this.setProperties({
                page: page
            });

            /**
             * @event Pager#pagechange
             */
            this.trigger('pagechange');
        }
    }

    lib.inherits(Pager, SuperClass);

    return Pager;

});
