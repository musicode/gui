/**
 * @file 修正浏览器 input 事件
 * @author  zhujl
 */
define(function (require, exports) {

    var advice = require('./advice');

    var input = document.createElement('input');
    var supportInputEvent = 'oninput' in input;
    input = null;

    var IE9 = window.addEventListener && !window.Worker;

    /**
     * IE9+ 和 其他标准浏览器都支持 input 事件
     * IE8- 支持 propertychange 事件，需判断 event.propertyName 是否为 'value'
     *
     * input 标准触发方式包括：输入、backspace、delete、ctrl+c、ctrl+v、右键剪切和粘贴
     *
     * IE9的 input 事件  不支持 backspace、delete、ctrl+c、右键剪切 触发
     * IE8-的 propertychange 事件触发方式和 input 标准方式相同
     * IE8-改写 value 会触发 propertychange
     *
     */

    function onPropertyChange(e, options) {
        var name = e.originalEvent.propertyName;
        if (name === 'value') {
            options.element.trigger('input');
        }
    }

    function onKeyup(e, options) {
        var keyCode = e.keyCode;
        if (keyCode === 8 || keyCode === 46) {
            options.element.trigger('input');
        }
    }

    /**
     * 使输入框元素具有 input 事件
     *
     * @param {Object} options
     * @param {jQuery} options.element 输入框元素
     */
    exports.enable = function (options) {

        var element = options.element;

        // 监听是否是改值触发
        advice.before(element, 'val', function () {
            options._callVal = true;
        });

        var handler;
        if (supportInputEvent && IE9) {
            options.type = 'keyup';
            handler = onKeyup;
        }
        else {
            options.type = 'propertychange';
            handler = onPropertyChange;
        }

        options.handler = function (e) {
            if (options._callVal) {
                delete options._callVal;
                return;
            }
            handler(e, options);
        };

        element.on(options.type, options.handler);
    };

    exports.disable = function (options) {
        var element = options.element;
        if (options.type && options.handler) {
            element.off(options.type, options.handler);
            delete options.type;
            delete options.handler;
        }
    };

});
