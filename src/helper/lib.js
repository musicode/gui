/**
 * @file   工具方法
 * @author zhujl
 */
define(function (require, exports, module) {

    var gui = require('../main');

    window.p = function (s) {
        console.log(s);
    };

    var splice = Array.prototype.splice;

    /**
     * 是否支持 ajax 上传
     *
     * @type {boolean}
     */
    exports.supportAjaxUpload = typeof FormData !== 'undefined';

    /**
     * 创建一个 div 元素
     * 便于 innerHTML 取得 firstChild
     *
     * @type {HTMLElement}
     */
    exports.divElement = document.createElement('div');

    /**
     * 用一段 html 文本创建元素
     *
     * @param {string} html
     * @return {HTMLElement}
     */
    exports.createElement = function (html) {
        exports.divElement.innerHTML = html;
        return exports.divElement.firstChild;
    };

    var win;
    var doc;

    exports.getDocument = function () {
        if (!doc) {
            doc = $(document);
        }
        return doc;
    };

    exports.getWindow = function () {
        if (!win) {
            win = $(window);
        }
        return win;
    };

    /**
     * 把 from 补充进 to
     *
     * @param {Object} to
     * @param {Object} from
     */
    exports.supply = function (to, from) {
        for (var key in from) {
            if (to[key] == null
                && from[key] != null
            ) {
                to[key] = from[key];
            }
        }
    };

    /**
     * 控件继承方法
     *
     * @param {Function} subClass 子类构造函数
     * @param {Function} superClass 父类构造函数
     */
    exports.inherits = function (subClass, superClass) {

        var Class = new Function();
        Class.prototype = superClass.prototype;

        var extend = subClass.prototype;
        // 原型继承
        var proto = subClass.prototype = new Class();

        for (var key in extend) {
            proto[key] = extend[key];
        }

        subClass.prototype.constructor = subClass;

        // 最后继承一下画笔
        var superPainter = superClass.painter;
        var subPainter = subClass.painter;

        if (superPainter) {

            if (!subPainter) {
                subPainter = subClass.painter = { };
            }

            for (var key in superPainter) {
                if (!subPainter[key]) {
                    subPainter[key] = superPainter[key];
                }
            }
        }

        return subClass;
    };

    /**
     * 获得元素的索引
     *
     * @param {HTMLElement} element
     * @return {number}
     */
    exports.getElementIndex = function (element) {
        var parentNode = element.parentNode;

        if (!parentNode) {
            return -1;
        }

        var index = -1;
        var current = parentNode.firstChild;
        // 如果是元素节点，才 + 1
        while (current) {
            if (current.nodeType === 1) {
                index++;

                if (current === element) {
                    return index;
                }
            }
            current = current.nextSibling;
        }

        return -1;
    };

    /**
     * container 是否包含 element
     * 同样会判断 container 是否就是 element
     *
     * @param {HTMLElement} container
     * @param {HTMLElement} element
     * @return {boolean}
     */
    exports.contains = function (container, element) {
        if (container === element) {
            return true;
        }
        return $.contains(container, element);
    };

    /**
     * 扩展数组的 splice 方法
     *
     * @param {Array} array
     * @param {number} index 开始删除的位置
     * @param {number} length 删除的数量
     * @param {Array} newArray 插入的数组
     */
    exports.splice = function (array, index, length, newArray) {
        // 调这个方法必然是为了 newArray，所以不可能为空
        var ret = [ ];
        // 浅拷贝一下
        for (var i = 0, len = newArray.length; i < len; i++) {
            ret.push(newArray[i]);
        }

        ret.unshift(length);
        ret.unshift(index);

        splice.apply(array, ret);
    };

    /**
     * 获得对象的 key 数组
     *
     * @param {Object} target;
     * @return {Array.<string>}
     */
    exports.keys = function (target) {
        var keys = [ ];

        if (target) {
            for (var key in target) {
                keys.push(key);
            }
        }

        return keys;
    };


    exports.startWith = function (str, value) {
        if (value === '') {
            return true;
        }
        if (str == null || value == null) {
            return false;
        }

        str = String(str);
        value = String(value);

        return str.length >= value.length && str.slice(0, value.length) === value;
    };

    exports.endWith = function (str, value) {
        if (value === '') {
            return true;
        }
        if (str == null || value == null) {
            return false;
        }

        str = String(str);
        value = String(value);

        return str.length >= value.length && str.slice(str.length - value.length) === value;
    };

    /**
     * 排序
     *
     * @param {Array} array 排序数据
     * @param {string} field 排序字段
     * @param {string} method 排序方式，asc 或 desc
     */
    exports.sort = function (array, field, method) {

        var compare;

        function numberic(value1, value2) {
            return value1 - value2;
        };

        function text(value1, value2) {
            return value1.localeCompare(value2);
        };

        array.sort(function(obj1, obj2) {
            var value1 = obj1[ field ];
            var value2 = obj2[ field ];

            if (!compare) {
                compare = isNaN(Number(value1)) ? text : numberic;
            }

            var ret = compare(value1, value2);

            return method === 'asc' ? ret : -1 * ret;
        });

    };

    /**
     * 获得滚动条的宽度
     *
     * @param {jQuery} element
     * @return {number}
     */
    exports.getScrollbarWidth = function (element) {

        // offset = border + padding + content
        // client = padding + content

        var borderLeftWidth = parseInt(element.css('border-left-width'), 10);
        var borderRightWidth = parseInt(element.css('border-right-width'), 10);
        var offsetWidth = element[0].offsetWidth;
        var clientWidth = element[0].clientWidth;

        return offsetWidth - borderLeftWidth - borderRightWidth - clientWidth;
    };

    /**
     * 模版方法
     *
     * @param {string} tpl 模版文本
     * @param {Object} data 混合的数据
     * @return {string}
     */
    exports.template = function (tpl, data) {
        var expr = /\$\{(.+?)\}/g;
        return tpl.replace(expr, function ($0, $1) {
            return data[$1];
        });
    };

    // 已存在的随机数
    var randomData = { };
    // 随机值的长度
    var randomSize = 10;
    // 随机值从以下字符中产生
    var randomSeed = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g',
        'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u',
        'v', 'w', 'x', 'y', 'z', 0, 1, 2,
        3,    4,   5,   6,   7,   8,   9
    ];

    /**
     * 生成一个随机值
     *
     * @return {string}
     */
    exports.random = function () {
        var ret = [ ];
        var seedSize = randomSeed.length;

        for (var i = 0; i < randomSize; i++) {
            var index = Math.random() * seedSize;
            // 取整
            index = Math.floor(index);
            ret.push(randomSeed[index]);
        }

        ret = 'ui-' + ret.join('');

        if (!randomData[ret]) {
            randomData[ret] = 1;
            return ret;
        } else {
            return arguments.callee();
        }
    };

    var guid = 0;

    /**
     * 获得全局唯一 ID
     *
     * @return {string}
     */
    exports.getGUID = function () {
        // 这样还能查看已经创建过多少实例
        return gui.config.uiClassPrefix + (guid++);
    };

    /**
     * 是否支持 flash
     *
     * @type {boolean}
     */
    exports.supportFlash = (function () {

        var mime = navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash'];
        return mime ? true : false;

    })();

    /**
     * 检测是否支持 input 事件
     *
     * @type {boolean}
     */
    exports.supportInputEvent = (function () {

        var input = document.createElement('input');
        var result = 'oninput' in input;
        input = null;

        return result;
    })();

    /**
     * 是否长按某键
     *
     * @type {number}
     */
    exports.keyPressed = null;

    var doc = exports.getDocument();
    var prevKey;

    doc.keydown(function (e) {
        var keyCode = e.keyCode;
        if (keyCode === prevKey) {
            exports.keyPressed = keyCode;
        }
        else {
            prevKey = keyCode;
        }
    });

    doc.keyup(function () {
        prevKey = null;
        exports.keyPressed = null;
    });

    exports.KEYCODE_UP = 38;
    exports.KEYCODE_DOWN = 40;

    /**
     * keyCode 是否是字符键
     *
     * @param {number} keyCode
     * @return {boolean}
     */
    exports.isCharkey = function (keyCode) {
        return (keyCode >= 65 && keyCode <= 90)       // A-Z
                || (keyCode >= 48 && keyCode <= 57)   // 主键盘的数字键
                || (keyCode >= 96 && keyCode <= 105)  // 小键盘的数字键
                || keyCode == 32                      // 空格键
                || keyCode == 8;                      // 退格键
    };

    /**
     * LifeCycle 枚举
     *
     * @type {Object}
     */
    exports.LifeCycle = {
        // new 开始
        NEW: 0,

        // new 结束
        INITED: 1,

        // 调用过 render 方法
        RENDERED: 2,

        // 设置新的属性，却没有同步到视图
        CHANGED: 3,

        // 调用了 dispose 方法
        DISPOSED: 4
    };

});
