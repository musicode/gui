/**
 * @file Popup
 * @author zhujl
 */
define (function (require) {

    'use strict';
    
    var lib = require('../helper/lib');

    function showClick(e) {
        var options = e.data;
        var overlay = options.overlay;
        if (overlay.isHidden()) {
            overlay.show();
        }
        e.preventDefault();
    }

    function showEnter(e) {

        var options = e.data;
        var overlay = options.overlay;

        // 任务正等待执行
        if (overlay._showTimer) {
            return;
        }

        // 启动显示任务
        // 延时显示，不然太敏感了
        overlay._showTimer = setTimeout(function () {
            if (overlay._showTimer) {
                if (overlay.isHidden()) {
                    overlay.show();
                }
                delete overlay._showTimer;
            }
        }, 100);
    }

    function showLeave(e) {

        var options = e.data;

        // 删除显示任务
        var overlay = options.overlay;
        var timer = overlay._showTimer;

        if (timer) {
            clearTimeout(timer);
            delete overlay._showTimer;
        }
    }

    function onaftershow(e) {

        var options = this;
        var overlay = options.overlay;
        var hideBy = options.hideBy;

        if (hideBy.indexOf('out') !== -1) {
            var trigger = options.trigger;
            var main = options.overlay.main;

            trigger.mouseleave(options, hideLeave);
            trigger.mouseenter(options, hideEnter);
            main.mouseleave(options, hideLeave);
            main.mouseenter(options, hideEnter);
        }

        if (hideBy.indexOf('blur') !== -1) {
            var showBy = options.showBy;

            if (showBy.indexOf('click') !== -1) {
                setTimeout(function () {
                    hideByBlur(overlay);
                }, 50);
            }
            else {
                hideByBlur(overlay);
            }
        }
    }

    function hideByBlur(overlay) {

        if (overlay.stage < lib.LifeCycle.DISPOSED
            && !overlay.isHidden()
        ) {

            var onclick = function (e) {
                if (!lib.contains(overlay.main[0], e.target)) {
                    overlay.hide();
                }
            };

            overlay._onclick = onclick;

            var doc = lib.getDocument();
            doc.click(onclick);
        }
    }

    function onafterhide(e) {

        var options = this;
        var overlay = options.overlay;

        if (options.hideBy.indexOf('out') !== -1) {
            var trigger = options.trigger;
            var main = overlay.main;

            trigger.off('mouseleave', hideLeave);
            trigger.off('mouseenter', hideEnter);
            main.off('mouseleave', hideLeave);
            main.off('mouseenter', hideEnter);
        }

        var onclick = overlay._onclick;
        if (typeof onclick === 'function') {
            var doc = lib.getDocument();
            doc.off('click', onclick);
            delete overlay._onclick;
        }
    }

    function hideEnter(e) {
        var options = e.data;
        var overlay = options.overlay;

        // 删掉隐藏任务
        var timer = overlay._hideTimer;
        if (timer) {
            clearTimeout(timer);
            delete overlay._hideTimer;
        }
    }

    function hideLeave(e) {
        var options = e.data;

        var trigger = options.trigger;
        var overlay = options.overlay;

        function isLeave(element) {
            return !lib.contains(trigger[0], element)
                && !lib.contains(overlay.main[0], element);
        }

        // 启动隐藏任务
        overlay._hideTimer = setTimeout(function () {
            if (overlay._hideTimer) {
                if (!overlay.isHidden()) {
                    var relatedTarget = e.relatedTarget;

                    if (isLeave(e.relatedTarget)) {
                        overlay.hide();
                    }
                }
                delete overlay._hideTimer;
            }
        }, 500);
    }

    /*
     * @param {Object} options
     * @param {jQuery} options.trigger
     * @param {Control} options.overlay
     * @param {string} options.showBy click|over
     * @param {string} options.hideBy blur|out
     */
    return function (options) {

        var trigger = options.trigger;
        var overlay = options.overlay;

        if (options.showBy === 'click') {
            trigger.on('click', options, showClick);
        }
        else {
            trigger.on('mouseenter', options, showEnter);
            trigger.on('mouseleave', options, showLeave);
        }

        overlay.on('aftershow', onaftershow, options);
        overlay.on('afterhide', onafterhide, options);
    };

});
