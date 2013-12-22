/**
 * @file 工具方法
 * @author zhujl
 */
define(function (require, exports, module) {

    'use strict';

    var gui = require('../main');

    window.p = function (s) {
        console.log(s);
    };

    // ==================================================================
    // 特性检测
    // ==================================================================

    /**
     * 是否支持 ajax 上传
     *
     * @type {boolean}
     */
    exports.supportAjaxUpload = typeof window.FormData !== 'undefined';

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
     * 检测输入框是否支持 input 事件
     *
     * @type {boolean}
     */
    exports.supportInputEvent = (function () {

        var input = document.createElement('input');
        var result = 'oninput' in input;
        input = null;

        return result;
    })();

    // ==================================================================
    // DOM
    // ==================================================================

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

    /**
     * 遍历子元素
     *
     * @param {HTMLElement} element
     * @param {Function=} callback
     */
    exports.traverseChildren = function (element, callback) {
        var current = element.firstChild;
        while (current) {
            callback(current);
            current = current.nextSibling;
        }
    };

    /**
     * 获得元素在同级元素中的索引
     *
     * @param {HTMLElement} element
     * @return {number}
     */
    exports.getElementIndex = function (element) {
        var index = -1;
        var result = -1;

        exports.traverseChildren(element.parentNode, function (current) {
            if (current.nodeType === 1) {
                index++;
                if (current === element) {
                    result = index;
                }
            }
        });

        return result;
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

    var win;
    var doc;
    var body;

    /**
     * 统一通过此方法获取封装过的 window 对象
     *
     * @return {jQuery}
     */
    exports.getWindow = function () {
        if (!win) {
            win = $(window);
        }
        return win;
    };

    /**
     * 统一通过此方法获取封装过的 document 对象
     *
     * @return {jQuery}
     */
    exports.getDocument = function () {
        if (!doc) {
            doc = $(document);
        }
        return doc;
    };

    /**
     * 统一通过此方法获取封装过的 document.body 对象
     *
     * @return {jQuery}
     */
    exports.getBody = function () {
        if (!body) {
            body = $(document.body);
        }
        return body;
    };

    /**
     * 获得元素当前 style 属性的快照
     *
     * @param {HTMLElement} element
     * @return {Object}
     */
    exports.copyStyle = function (element) {
        var style = element.style;
        var result = { };

        if (style) {
            for (var key in style) {
                if (typeof style[key] === 'string') {
                    result[key] = style[key];
                }
            }
        }

        return result;
    };

    /**
     * 获得容器元素中 element 的高度
     *
     * @param  {jQuery} container
     * @param  {jQuery} element
     * @return {number}
     */
    exports.getHeight = function (container, element) {
        var height = element.height();

        // 如果是隐藏状态，必须先显示出来再取值
        if (height === 0
            && container.css('display') === 'none'
        ) {

            var style = exports.copyStyle(container[0]);
            container.css({
                display: 'block',
                position: 'absolute',
                left: -10000,
                top: -10000
            });

            height = element.height();
            container.css(style);
        }

        return height;
    };

    // ===========================================================
    // 自定义元素
    // ===========================================================

    /**
     * 获得 checkbox 模板
     *
     * @param {Array} classes
     * @param {Array} attrs
     * @return {string}
     */
    exports.getCheckbox = function (classes, attrs) {
        classes = classes || [];
        classes.push('i-checkbox');

        var className = classes.join(' ');
        var attr = '';

        if (attrs) {
            for (var key in attrs) {
                attr += ' ' + key + '="' + attrs[key] + '"';
            }
        }

        return '<span class="' + className + '"' + attr + '></span>';
    };

    /**
     * 获得 checkbox 的选中状态
     *
     * @param  {HTMLElement} element
     * @return  {boolean}
     */
    exports.getCheckboxChecked = function (element) {
        return element.getAttribute('selected') === 'selected';
    };

    /**
     * 设置 checkbox 的选中状态
     *
     * @param  {HTMLElement} element
     * @param  {boolean} checked 是否选中
     */
    exports.setCheckboxChecked = function (element, checked) {
        if (checked) {
            element.setAttribute('selected', 'selected');
        }
        else {
            element.removeAttribute('selected');
        }
    };


    // =========================================================
    // 语言增强
    // =========================================================

    /**
     * 把连字符形式转成驼峰形式，如 margin-left => marginLeft
     *
     * @param {string} str
     * @return {string}
     */
    exports.camelize = function (str) {
        return str.replace(/-([a-z])/g, function($0, $1) {
            return $1.toUpperCase();
        });
    };

    /**
     * 首字母大写
     *
     * @param {string} str
     * @return {string}
     */
    exports.capitalize = function (str) {
        var first = str.slice(0, 1).toUpperCase();
        return first + str.slice(1);
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

    var splice = Array.prototype.splice;

    /**
     * 把数组转成对象，便于快速查找
     *
     * @param {Array} array
     * @param {string} key
     * @param {string=} value
     * @return {Object}
     */
    exports.array2Object = function (array, key, value) {
        var result = { };
        $.each(array, function (index, item) {
            result[item[key]] = value ? item[value] : item;
        });
        return result;
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
     * @param {Object} target
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

    /**
     * 数组排序
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
        exports.keyPressed = prevKey = null;
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

    // ===================================================================
    // 事件
    // ===================================================================

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

    /**
     * 控件继承方法
     *
     * @param {Function} subClass 子类构造函数
     * @param {Function} superClass 父类构造函数
     */
    exports.inherits = function (subClass, superClass) {

        // 创建一个空构造函数
        // 避免执行控件构造函数里的复杂逻辑
        var Class = new Function();
        Class.prototype = superClass.prototype;

        var overRide = subClass.prototype;
        // 原型继承
        var proto = subClass.prototype = new Class();

        // 原型覆盖
        for (var key in overRide) {
            proto[key] = overRide[key];
        }

        // 指定构造函数
        subClass.prototype.constructor = subClass;
        // 指定父类，不然只能通过 __proto__ 访问
        subClass.prototype.superClass = superClass;

        // 最后继承一下画笔
        var superPainters = superClass.painters;
        var subPainters = subClass.painters;

        if (superPainters) {
            subClass.painters = inheritsPainter(
                subPainters,
                superPainters
            );
        }

        return subClass;
    };

    /**
     * 继承画笔
     */
    function inheritsPainter(subPainters, superPainters) {
        var result = $.extend(true, [], superPainters);

        if (subPainters) {
            var map = exports.array2Object(result, 'name');
            $.each(subPainters, function (index, item) {
                if (map[item.name]) {
                    delete map[item.name];
                }
                result.push(item);
            });
        }

        return result;
    }

});
