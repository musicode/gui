/**
 * @file draggable
 * @author zhujl
 */
define(function (require, exports) {

    'use strict';

    var lib = require('./lib');

    // 容器
    var container;
    // 拖拽对象
    var target;
    // target 是否是 container 的子元素
    var isChild;

    // 按下鼠标的全局坐标 (相对容器来说)
    var globalX;
    var globalY;

    // 按下鼠标的局部坐标
    var localX;
    var localY;

    /**
     * 触发拖拽
     *
     * @param {Object} e 事件对象
     */
    function startDrag(e, options) {

        if (options._dragging) {
            stopDrag(e, options);
        }

        var element = options.element;

        // 判断是否点击在 cancel 区域
        if (options.cancel) {
            var cancel = element.find(options.cancel)[0];
            if (cancel && lib.contains(cancel, e.target)) {
                return;
            }
        }

        // 判断是否点击在 handle 区域
        if (options.handle) {
            var handle = element.find(options.handle)[0];
            if (handle && !lib.contains(handle, e.target)) {
                return;
            }
        }

        // 计算拖拽范围
        var containment = options.containment || lib.getBody();
        var offset = containment.offset();

        container = {
            x: offset.left,
            y: offset.top,
            width: containment.prop('scrollWidth'),
            height: containment.prop('scrollHeight')
        };

        offset = element.offset();

        target = {
            x: offset.left,
            y: offset.top,
            width: element.width(),
            height: element.height()
        };

        globalX = e.pageX - container.x;
        globalY = e.pageY - container.y;

        localX = e.pageX - target.x;
        localY = e.pageY - target.y;

        isChild = lib.contains(containment[0], element[0]);

        options._dragging = function (e) {
            dragging(e, options);
        };
        options._stopDrag = function (e) {
            stopDrag(e, options);
        };

        var doc = lib.getDocument();
        doc.on('mousemove', options._dragging);
        doc.on('mouseup', options._stopDrag);

        // 避免出现选区
        lib.getBody().attr('unselectable', 'unselectable');
    }

    /**
     * 正在拖拽
     *
     * @param {Object} e 事件对象
     */
    function dragging(e, options) {

        var x = e.pageX - container.x - localX;
        var y = e.pageY - container.y - localY;

        // 纠正范围
        var temp;
        if (x < 0) {
            x = 0;
        }
        else if (x > (temp = container.width - target.width)) {
            x = temp;
        }

        if (y < 0) {
            y = 0;
        }
        else if (y > (temp = container.height - target.height)) {
            y = temp;
        }

        // 限制方向
        var axis = options.axis;
        if (axis) {
            if (axis === 'x') {
                // 重置 y
                y = globalY - localY;
            }
            else {
                x = globalX - localX;
            }
        }

        if (!isChild) {
            x += container.x;
            y += container.y;
        }

        var element = options.element;
        element.trigger('dragging', { x: x, y: y });

        // 如果是静默的，则什么也不做
        if (!options.silence) {
            element.css({
                left: x,
                top: y
            });
        }
    }

    /**
     * 停止拖拽
     */
    function stopDrag(e, options) {

        var doc = lib.getDocument();

        if (options._dragging) {
            doc.off('mousemove', options._dragging);
            delete options._dragging;
        }
        if (options._stopDrag) {
            doc.off('mouseup', options._stopDrag);
            delete options._stopDrag;
        }

        container = target = null;

        lib.getBody().removeAttr('unselectable');
    }

    /**
     * 启用拖拽
     *
     * @param {Object} options
     * @param {jQuery} options.element 需要拖拽的元素
     * @param {jQuery=} options.containment 限制拖拽范围的容器，默认是 document.body
     * @param {string=} options.handle 触发拖拽的区域 (css选择器)
     * @param {string=} options.cancel 不触发拖拽的区域 (css选择器)
     * @param {string=} options.axis 限制方向，x 或 y
     * @param {boolean=} options.silence 是否啥也不做，仅把当前坐标通过事件传出去
     */
    exports.enable = function (options) {

        var element = options.element;
        options._startDrag = function (e) {
            startDrag(e, options);
        };

        element.attr('draggable', 'draggable');
        element.on('mousedown', options._startDrag);
    };

    /**
     * 禁用拖拽
     *
     * @param {Object} options 传入 enable 的配置对象
     */
    exports.disable = function (options) {
        var element = options.element;
        element.removeAttr('draggable');
        if (options._startDrag) {
            element.off('mousedown', startDrag);
            delete options._startDrag;
        }
    };

});
