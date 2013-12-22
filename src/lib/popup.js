/**
 * @file popup
 * @author zhujl
 */
define(function (require, exports) {

    'use strict';

    var lib = require('./lib');
    var advice = require('./advice');

    /**
     * click 事件触发显示
     *
     * @private
     * @param {Object} options
     */
    function showClick(options) {
        options.show();
    }

    /**
     * mouseenter 事件触发显示
     *
     * @private
     * @param {Object} options
     */
    function showEnter(options) {

        // 任务正等待执行
        if (options.task) {
            return;
        }

        // 启动显示任务
        // 延时显示，不然太灵敏了
        options.task = setTimeout(function () {
            if (options.task) {
                options.show();
                delete options.task;
            }
        }, options.showDelay);
    }

    /**
     * 为了避免太灵敏的触发显示
     * mouseenter 会开始一个显示任务，mouseleave 取消任务
     *
     * @private
     * @param {Object} options
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
     *
     * @private
     * @param {Object} options
     */
    function afterShow(options) {
        if (options.showBy.indexOf('click') !== -1) {
            // 用延时来避免 click 事件冒泡带来的悲剧
            setTimeout(function () {
                addHideEvent(options);
            }, 50);
        }
        else {
            addHideEvent(options);
        }
    }

    /**
     * 失焦触发隐藏
     *
     * @private
     * @param {Object} options
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
     *
     * @private
     * @param {Object} options
     */
    function hideEnter(options) {
        cleanTask(options);
    }

    /**
     * mouseleave 触发隐藏任务
     *
     * @private
     * @param {Object} options
     * @param {HTMLElement} relatedTarget
     */
    function hideLeave(options, relatedTarget) {

        if (options.task) {
            return;
        }

        var trigger = options.trigger;
        var element = options.element;

        if (!isOutside(relatedTarget, trigger[0], element[0])) {
            return;
        }

        // 启动隐藏任务
        options.task = setTimeout(function () {
            if (options.task) {
                if (element.css('display') !== 'none') {
                    options.hide();
                }
                delete options.task;
            }
        }, options.hideDelay);
    }

    /**
     * 隐藏之后需要解绑事件
     *
     * @private
     * @param {Object} options
     */
    function afterHide(options) {
        removeHideEvent(options);
    }

    /**
     * 添加触发显示的事件
     *
     * @private
     * @param {Object} options
     */
    function addShowEvent(options) {
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
    }

    /**
     * 添加触发隐藏的事件
     *
     * @private
     * @param {Object} options
     */
    function addHideEvent(options) {
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
            hideClick(options);
        }
    }

    /**
     * 移除触发显示的事件
     *
     * @private
     * @param {Object} options
     */
    function removeShowEvent(options) {
        var trigger = options.trigger;
        var element = options.element;

        cleanTask(options);

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
    }


    /**
     * 移除用于触发隐藏的事件
     *
     * @private
     * @param {Object} options
     */
    function removeHideEvent(options) {
        var trigger = options.trigger;
        var element = options.element;

        cleanTask(options);

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

        if (options._hideClick) {
            var doc = lib.getDocument();
            doc.off('click', options._hideClick);
            delete options._hideClick;
        }
    }

    /**
     * target 是否不在 arguments[1], arguments[2], ... 范围内
     *
     * @private
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
     * 清空延时任务
     *
     * @private
     * @param {Object} options
     */
    function cleanTask(options) {
        if (options.task) {
            clearTimeout(options.task);
            delete options.task;
        }
    }

    /**
     * 默认配置
     *
     * @private
     * @type {Object}
     */
    var defaultOptions = {
        showBy: 'click',
        hideBy: 'blur',
        showDelay: 100,
        hideDelay: 200,
        show: function () {
            this.element.show();
        },
        hide: function () {
            this.element.hide();
        }
    };

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
     * @param {number=} options.showDelay 当 showBy 为 over 时的显示延时
     * @param {number=} options.hideDelay 当 hideBy 包含 out 时的隐藏延时
     * @param {Function=} options.show 可选，默认是 options.element.show()
     * @param {Function=} options.hide 可选，默认是 options.element.hide()
     * @param {Function=} options.onBeforeShow
     * @param {Function=} options.onAfterShow
     * @param {Function=} options.onBeforeHide
     * @param {Function=} options.onAfterHide
     */
    exports.enable = function (options) {

        for (var key in defaultOptions) {
            if (options[key] == null) {
                options[key] = defaultOptions[key];
            }
        }

        options._show = options.show;
        options._hide = options.hide;

        advice.around(options, 'show',
        function () {
            var current = options.element._current;
            if (current) {
                current.hide();
            }
            options.element._current = options;
            if (typeof options.onBeforeShow === 'function') {
                options.onBeforeShow();
            }
        },
        function () {
            afterShow(options);
            if (typeof options.onAfterShow === 'function') {
                options.onAfterShow();
            }
        });
        advice.around(options, 'hide', options.onBeforeHide, function () {
            options.element._current = null;
            afterHide(options);
            if (typeof options.onAfterHide === 'function') {
                options.onAfterHide();
            }
        });

        addShowEvent(options);
    };

    /**
     * @param {Object} options 传入 enable 的对象
     */
    exports.disable = function (options) {
        // 还原
        options.show = options._show;
        options.hide = options._hide;

        // 解绑事件
        removeShowEvent(options);
        removeHideEvent(options);
    };

});
