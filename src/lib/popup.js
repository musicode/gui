/**
 * @file popup
 * @author zhujl
 */
define (function (require, exports) {

    'use strict';

    var lib = require('./lib');

    /**
     * click 事件触发显示
     */
    function showClick(e) {
        var options = e.data;
        var element = options.element;

        if (typeof options.onshow === 'function'
            && element.css('display') === 'none'
        ) {
            options.onshow();
        }

        afterShow(options);
    }

    /**
     * mouseenter 事件触发显示
     */
    function showEnter(e) {

        var options = e.data;
        var element = options.element;

        // 任务正等待执行
        if (element.data('waiting')) {
            return;
        }

        // 启动显示任务
        // 延时显示，不然太灵敏了
        var task = setTimeout(function () {
            if (element.data('waiting')) {
                if (typeof options.onshow === 'function'
                    && element.css('display') === 'none'
                ) {
                    options.onshow();
                    afterShow(options);
                }
                element.removeData('waiting');
            }
        }, 100);

        element.data('waiting', task);
    }

    /**
     * 为了避免太灵敏的触发显示
     * mouseenter 会开始一个显示任务，mouseleave 取消任务
     */
    function showLeave(e) {

        var options = e.data;

        // 删除显示任务
        var element = options.element;
        var task = element.data('waiting');

        if (task) {
            clearTimeout(task);
            element.removeData('waiting');
        }
    }

    function afterShow(options) {

        var element = options.element;
        var hideBy = options.hideBy;

        if (hideBy.indexOf('out') !== -1) {
            var trigger = options.trigger;

            trigger.mouseleave(options, hideLeave);
            trigger.mouseenter(options, hideEnter);
            element.mouseleave(options, hideLeave);
            element.mouseenter(options, hideEnter);
        }

        if (hideBy.indexOf('blur') !== -1) {
            var showBy = options.showBy;

            if (showBy.indexOf('click') !== -1) {
                // 用延时来避免 click 事件冒泡带来的悲剧
                setTimeout(function () {
                    hideByBlur(options);
                }, 50);
            }
            else {
                hideByBlur(options);
            }
        }
    }

    function outside(target) {
        var temp;

        for (var i = 1, len = arguments.length; i < len; i++) {
            temp = lib.contains(arguments[i], target);
            if (temp) {
                return false;
            }
        }
        return true;
    }

    function hideByBlur(options) {
        var element = options.element;
        if (element.css('display') !== 'none') {

            var onblur = function (e) {
                if (typeof options.onhide === 'function'
                    && outside(e.target, element[0])
                ) {
                    options.onhide();
                    afterHide(options);
                }
            };

            element.onblur = onblur;

            var doc = lib.getDocument();
            doc.click(onblur);
        }
    }

    function afterHide(options) {

        var element = options.element;

        if (options.hideBy.indexOf('out') !== -1) {
            var trigger = options.trigger;

            trigger.off('mouseleave', hideLeave);
            trigger.off('mouseenter', hideEnter);
            element.off('mouseleave', hideLeave);
            element.off('mouseenter', hideEnter);
        }

        var onblur = element.onblur;
        if (typeof onblur === 'function') {
            var doc = lib.getDocument();
            doc.off('click', onblur);
            delete element.onblur;
        }
    }

    function hideEnter(e) {
        var options = e.data;
        var element = options.element;

        // 删掉隐藏任务
        var task = element.data('waiting');
        if (task) {
            clearTimeout(task);
            element.removeData('waiting');
        }
    }

    function hideLeave(e) {
        var options = e.data;

        var trigger = options.trigger;
        var element = options.element;

        // 启动隐藏任务
        var task = setTimeout(function () {
            if (element.data('waiting')) {
                if (typeof options.onhide === 'function'
                    && element.css('display') !== 'none'
                    && outside(e.relatedTarget, trigger[0], element[0])
                ) {
                    options.onhide();
                    afterHide(options);
                }
                element.removeData('waiting');
            }
        }, 500);

        element.data('waiting', task);
    }

    /*
     * @param {Object} options
     * @param {jQuery} options.trigger
     * @param {jQuery} options.element
     * @param {string} options.showBy click|over
     * @param {string} options.hideBy blur|out
     * @param {Function} options.onshow
     * @param {Function} options.onhide
     */
    exports.enable = function (options) {

        var trigger = options.trigger;
        var element = options.element;

        if (options.showBy === 'click') {
            trigger.on('click', options, showClick);
        }
        else {
            trigger.on('mouseenter', options, showEnter);
            trigger.on('mouseleave', options, showLeave);
        }
    };

    exports.disable = function () {

    };

});
