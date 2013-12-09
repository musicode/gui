/**
 * @file popup
 * @author zhujl
 */
define(function (require, exports) {

    'use strict';

    var lib = require('./lib');

    /**
     * click 事件触发显示
     */
    function showClick(options) {
        var element = options.element;
        if (element.css('display') === 'none') {
            options.show();
        }
    }

    /**
     * mouseenter 事件触发显示
     */
    function showEnter(options) {

        var element = options.element;

        // 任务正等待执行
        if (options.task) {
            return;
        }

        // 启动显示任务
        // 延时显示，不然太灵敏了
        var task = setTimeout(function () {
            if (options.task) {
                if (element.css('display') === 'none') {
                    options.show();
                }
                delete options.task;
            }
        }, 100);

        options.task = task;
    }

    /**
     * 为了避免太灵敏的触发显示
     * mouseenter 会开始一个显示任务，mouseleave 取消任务
     */
    function showLeave(options) {
        // 删除显示任务
        if (options.task) {
            clearTimeout(options.task);
            delete options.task;
        }
    }

    /**
     * 显示完之后需要绑定事件触发隐藏逻辑
     */
    function afterShow(options) {

        var hideBy = options.hideBy;

        if (hideBy.indexOf('out') !== -1) {
            var trigger = options.trigger;
            var element = options.element;

            options._hideLeave = function (e) {
                hideLeave(options, e.relatedTarget);
            };
            options._hideEnter = function () {
                hideEnter(options);
            };

            trigger.mouseleave(options._hideLeave);
            trigger.mouseenter(options._hideEnter);
            element.mouseleave(options._hideLeave);
            element.mouseenter(options._hideEnter);
        }

        if (hideBy.indexOf('blur') !== -1) {
            var showBy = options.showBy;

            if (showBy.indexOf('click') !== -1) {
                // 用延时来避免 click 事件冒泡带来的悲剧
                setTimeout(function () {
                    hideClick(options);
                }, 50);
            }
            else {
                hideClick(options);
            }
        }
    }

    /**
     * 失焦触发隐藏
     */
    function hideClick(options) {
        var element = options.element;
        if (element.css('display') !== 'none') {

            options._hideClick = function (e) {
                if (isOutside(e.target, element[0])) {
                    options.hide();
                }
            };

            var doc = lib.getDocument();
            doc.click(options._hideClick);
        }
    }

    /**
     * mouseleave 之后如果触发 mouseenter 需删掉隐藏任务
     */
    function hideEnter(options) {
        // 删掉隐藏任务
        if (options.task) {
            clearTimeout(options.task);
            delete options.task;
        }
    }

    function hideLeave(options, relatedTarget) {

        var trigger = options.trigger[0];
        var element = options.element[0];

        // 启动隐藏任务
        options.task = setTimeout(function () {
            if (options.task) {
                if (element.css('display') !== 'none'
                    && isOutside(relatedTarget, trigger, element)
                ) {
                    options.hide();
                }
                delete options.task;
            }
        }, 500);
    }

    /**
     * 隐藏之后需要解绑事件
     */
    function afterHide(options) {

        var hideBy = options.hideBy;

        if (hideBy.indexOf('out') !== -1) {
            var trigger = options.trigger;
            var element = options.element;

            if (options._hideLeave) {
                trigger.off('mouseleave', options._hideLeave);
                element.off('mouseleave', options._hideLeave);
                delete options._hideLeave;
            }

            if (options._hideEnter) {
                trigger.off('mouseenter', options._hideEnter);
                element.off('mouseenter', options._hideEnter);
                delete options._hideEnter;
            }
        }

        if (options._hideClick) {
            var doc = lib.getDocument();
            doc.off('click', options._hideClick);
            delete options._hideClick;
        }
    }

    /**
     * target 是否不在 arguments[1], arguments[2], ... 范围内
     *
     * @param {HTMLElement} target 目标元素
     * @param {...HTMLElement} container 容器元素
     * @return {boolean}
     */
    function isOutside(target, container) {

        for (var i = 1, len = arguments.length; i < len; i++) {
            if (lib.contains(arguments[i], target)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 简单的弹出式交互
     *
     * 不涉及位置计算，仅包含显示隐藏逻辑
     *
     * @param {Object} options
     * @param {jQuery} options.trigger
     * @param {jQuery} options.element
     * @param {string} options.showBy 可选值有 click, over
     * @param {string} options.hideBy 可选值有 blur, out, blur|out
     * @param {Function=} options.show 可选，默认是 options.element.show()
     * @param {Function=} options.hide 可选，默认是 options.element.hide()
     * @param {Function=} options.onBeforeShow
     * @param {Function=} options.onAfterShow
     * @param {Function=} options.onBeforeHide
     * @param {Function=} options.onAfterHide
     */
    exports.enable = function (options) {

        var show = options.show;
        options._show = show;
        options.show = function () {
            if (typeof options.onBeforeShow === 'function') {
                options.onBeforeShow();
            }

            if (typeof show === 'function') {
                show();
            }
            else {
                options.element.show();
            }
            afterShow(options);

            if (typeof options.onAfterShow === 'function') {
                options.onAfterShow();
            }
        };

        var hide = options.hide;
        options._hide = hide;
        options.hide = function () {
            if (typeof options.onBeforeHide === 'function') {
                options.onBeforeHide();
            }

            if (typeof hide === 'function') {
                hide();
            }
            else {
                options.element.hide();
            }
            afterHide(options);

            if (typeof options.onAfterHide === 'function') {
                options.onAfterHide();
            }
        };

        var trigger = options.trigger;

        if (options.showBy === 'click') {
            options._showClick = function () {
                showClick(options);
            };
            trigger.on('click', options._showClick);
        }
        else {
            options._showEnter = function () {
                showEnter(options);
            };
            options._showLeave = function () {
                showLeave(options);
            };
            trigger.on('mouseenter', options._showEnter);
            trigger.on('mouseleave', options._showLeave);
        }
    };

    /**
     * @param {Object} options 传入 enable 的对象
     */
    exports.disable = function (options) {

        // 还原为原始的 show / hide
        options.show = options._show;
        if (options._show) {
            delete options._show;
        }

        options.hide = options._hide;
        if (options._hide) {
            delete options._hide;
        }

        var trigger = options.trigger;

        // 解绑事件
        if (options._showClick) {
            trigger.off('click', options._showClick);
            delete options._showClick;
        }

        if (options._showEnter) {
            trigger.off('mouseenter', options._showEnter);
            delete options._showEnter;
        }

        if (options._showLeave) {
            trigger.off('mouseleave', options._showLeave);
            delete options._showLeave;
        }
    };

});
