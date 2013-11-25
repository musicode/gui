/**
 * @file iterator
 * @author zhujl
 */
define(function (require, exports) {

    'use strict';

    var lib = require('./lib');

    /**
     * 按住上下键时遍历的速度，单位毫秒
     */
    var SPEED = 50;

    /**
     * 创建 keydown 事件处理函数
     */
    function createKeydownHandler() {
        return function (e) {
            var options = e.data;
            var keyCode = e.keyCode;
            var action = keyCode === lib.KEYCODE_UP ? prev :
                         keyCode === lib.KEYCODE_DOWN ? next : null;

            if (!action) {
                return;
            }

            if (lib.keyPressed == null) {
                action(options);
            }
            else if (options.task == null) {
                startTask(options, action);
            }
        };
    }

    /**
     * 创建 keyup 事件处理函数
     */
    function createKeyupHandler() {
        return function (e) {
            var options = e.data;
            if (options.task) {
                clearTimeout(options.task);
                delete options.task;
            }
        };
    }

    /**
     * 判断 index 是否在合法区间内
     *
     * @return {boolean}
     */
    function inRange(index, options) {
        return index >= options.min && index <= options.max;
    }

    /**
     * 向后遍历
     */
    function prev(options) {

        var currentIndex = options.index;
        var prevIndex = currentIndex;

        currentIndex--;

        if (options.loop && currentIndex < options.min) {
            currentIndex = options.max;
        }

        if (inRange(currentIndex, options)) {
            options.index = currentIndex;
            if (typeof options.onenter === 'function') {
                options.onenter.call(options.scope, currentIndex);
            }
        }

        if (inRange(prevIndex, options)
            && typeof options.onleave === 'function'
        ) {
            options.onleave.call(options.scope, prevIndex);
        }
    }

    /**
     * 向前遍历
     */
    function next(options) {

        var currentIndex = options.index;
        var prevIndex = currentIndex;

        currentIndex++;

        if (options.loop && currentIndex > options.max) {
            currentIndex = options.min;
        }

        if (inRange(currentIndex, options)) {
            options.index = currentIndex;
            if (typeof options.onenter === 'function') {
                options.onenter.call(options.scope, currentIndex);
            }
        }

        if (inRange(prevIndex, options)
            && typeof options.onleave === 'function'
        ) {
            options.onleave.call(options.scope, prevIndex);
        }
    }


    function startTask(options, action) {
        options.task = setTimeout(function () {
            action(options);
            startTask(options, action);
        }, SPEED);
    }

    /**
     * @param {Object} options
     * @param {number=} options.index 当前索引值
     * @param {number=} options.min 最小索引值, 如 0 表示最小值为第一个
     * @param {number=} options.max 最大索引值
     * @param {boolean=} options.loop 是否支持循环遍历
     * @param {Object=} options.scope onenter 和 onleave 的 this 指向
     * @param {Function=} onenter
     * @param {Function=} onleave
     */
    exports.enable = function (options) {
        if (options.onkeydown) {
            exports.disable(options);
        }

        options.onkeydown = createKeydownHandler();
        options.onkeyup = createKeyupHandler();

        var doc = lib.getDocument();
        doc.on('keydown', options, options.onkeydown);
        doc.on('keyup', options, options.onkeyup);
    };

    /**
     * 停止遍历功能
     *
     * @param {Object} options 传给 enable 的那个对象
     */
    exports.disable = function (options) {
        if (options.onkeydown) {
            var doc = lib.getDocument();
            doc.off('keydown', options.onkeydown);
            doc.off('keyup', options.onkeyup);

            delete options.onkeydown;
            delete options.onkeyup;
        }
    };

});
