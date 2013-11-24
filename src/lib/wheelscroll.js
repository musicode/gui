/**
 * @file 滚轮
 * @author zhujl
 */
define(function (require, exports) {

    'use strict';

    var div = document.createElement('div');
    var type = 'onmousewheel' in div ? 'mousewheel' : 'DOMMouseScroll';
    div = null;

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

        element.trigger('wheelscroll', {
            delta: value
        });

        e.preventDefault();
    }

    exports.enable = function (element) {
        element.on(type, element, scrollWheel);
    };

    exports.disable = function (element) {
        element.off(type);
    };

});