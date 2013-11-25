/**
 * @file position
 * @author zhujl
 */
define(function (require, exports) {

    'use strict';

    var lib = require('./lib');

    // 思路来自 http://aralejs.org/position/
    //
    // 通过`重合两个定位点`实现定位
    // 定位点坐标的写法只有两种：
    // 纯数字，如 10，表示 px
    // 百分比，如 100%，比较大致的位置，如这里的最右
    // 或者 100% + 10 这样的相对位置

    /**
     * 获得 pin 点的坐标
     *
     * @private
     * @param {Object} options
     *
     * @param {Object} options.pinObject
     * @param {jQuery} options.pinObject.element 这个元素必须是 body 下面的
     * @param {string} options.pinObject.x 定位点 x 坐标
     * @param {string} options.pinObject.y 定位点 y 坐标
     *
     * @param {Object} options.baseObject
     * @param {jQuery} options.baseObject.element
     * @param {string} options.baseObject.x 定位点 x 坐标
     * @param {string} options.baseObject.y 定位点 y 坐标
     */
    function getPinPosition(pinObject, baseObject) {

        var global = getGlobal(baseObject);
        var local = getLocal(pinObject);

        return {
            top: Math.ceil(global.y - local.y),
            left: Math.ceil(global.x - local.x)
        };
    }

    /**
     * 定位一个元素
     */
    function pin(pinObject, baseObject) {

        if (!baseObject) {
            // 默认以 body 左上角为基准
            baseObject = {
                element: lib.getBody(),
                x: '0',
                y: '0'
            };
        }

        // 确保是 jQuery 对象
        var pinElement = toJquery(pinObject.element);
        var baseElement = toJquery(baseObject.element);

        pinObject.element = pinElement;
        baseObject.element = baseElement;

        var position = getPinPosition(pinObject, baseObject);
        pinElement.css(position);
    }

    /**
     * 居中定位
     *
     * @param {(HTMLElement | jQuery)} pinElement
     * @param {(HTMLElement | jQuery)=} baseElement 可选, 默认以 body 为基准
     */
    function center(pinElement, baseElement) {

        var pinObject = {
            element: pinElement,
            x: '50%',
            y: '50%'
        };
        var baseObject = {
            element: baseElement || lib.getBody(),
            x: '50%',
            y: '50%'
        };

        pin(pinObject, baseObject);
    }

    /**
     * 获得相对视口的位置
     * 即元素的左上角坐标 + 自身的 (x, y) 偏移量
     *
     * @param {Object} obj
     * @param {jQuery} obj.element
     * @param {string} obj.x
     * @param {string} obj.y
     * @return {Object}
     */
    function getGlobal(obj) {

        var global = obj.element.offset();
        var local = getLocal(obj);

        return {
            x: global.left + local.x,
            y: global.top + local.y
        };
    }

    /**
     * 获得自己内部的偏移量
     *
     * @param {Object} obj
     * @param {jQuery} obj.element
     * @param {string} obj.x
     * @param {string} obj.y
     * @return {Object}
     */
    function getLocal(obj) {

        var element = obj.element;
        var x = obj.x;
        var y = obj.y;

        // 为了避免不必要的计算,这里写成传函数
        x = getPixel(x, function () {
            return element.outerWidth();
        });
        y = getPixel(y, function () {
            return element.outerHeight();
        });

        return {
            x: x,
            y: y
        };
    }

    /**
     * 获得像素值
     *
     * @param {string} raw 传入的原始值
     * @param {Function} getTotal 如果是百分比,会用到总值
     * @return {number}
     */
    function getPixel(raw, getTotal) {

        var ret = raw;

        var percent;
        var px;

        if (percentExpr.test(raw)) {
            percent = RegExp.$1 / 100;
            ret = getTotal() * percent;
        }
        else if (percentAndNumberExpr.test(raw)) {
            percent = RegExp.$1 / 100;
            ret = getTotal() * percent;
            px = RegExp.$3;

            if (RegExp.$2 === '+') {
                ret += px;
            }
            else if (RegExp.$2 === '-') {
                ret -= px;
            }
        }

        return Number(ret);
    }

    var percentExpr = /(\d+)%$/;
    var percentAndNumberExpr = /(\d)+%\s?([+-])\s?(\d+)/;

    function toJquery(element) {
        if (element.jquery == null) {
            element = $(element);
        }
        return element;
    }


    exports.pin = pin;
    exports.center = center;

});
