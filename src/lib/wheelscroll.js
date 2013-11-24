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
     */
    function scrollWheel(e) {
        var event = e.originalEvent;
        var element = e.data;
        var value;

        if (event.wheelDelta) {
            value = -1 * event.wheelDelta / 120;
        }
        else {
            value = event.detail;
        }

        /**
         * @event wheelscroll#wheelscroll
         */
        element.trigger('wheelscroll', {
            delta: value
        });

        // 避免让外层的原生滚动条滚动
        e.preventDefault();
    }

    exports.enable = function (element) {
        element.on(type, element, scrollWheel);
    };

    exports.disable = function (element) {
        element.off(type);
    };

});