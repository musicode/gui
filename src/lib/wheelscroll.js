/**
 * @file wheelscroll
 * @author zhujl
 */
define(function (require, exports) {

    'use strict';

    var div = document.createElement('div');
    var type = 'onmousewheel' in div ? 'mousewheel' : 'DOMMouseScroll';
    div = null;

    /**
     * 处理浏览器的兼容问题
     *
     * 向下滚动统一为正数
     * 向上滚动统一为负数
     * 滚动幅度取自 delta 属性
     *
     * @private
     * @param {Object} e
     */
    function scrollWheel(e) {
        var event = e.originalEvent;
        var options = e.data;
        var value;

        if (event.wheelDelta) {
            value = -1 * event.wheelDelta / 120;
        }
        else {
            value = event.detail / 3;
        }

        /**
         * @event wheelscroll#wheelScroll
         */
        options.element.trigger('wheelScroll', {
            delta: value
        });

        // 避免让外层的原生滚动条滚动
        if (!options.isOutside()) {
            e.preventDefault();
        }
    }

    /**
     * 监听 element 的鼠标滚轮
     *
     * @param {Object} options
     * @param {jQuery} options.element
     * @param {Function} options.isOutside 是否滚动出了自身边界
     *                                     即 < 0 或 > scrollHeight
     */
    exports.enable = function (options) {
        options.element.on(type, options, scrollWheel);
    };

    /**
     * 取消监听 element 的鼠标滚轮
     *
     * @param {Object} options 传入 enable 的配置对象
     */
    exports.disable = function (options) {
        options.element.off(type, scrollWheel);
    };

});
