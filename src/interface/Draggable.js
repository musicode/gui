/**
 * @file Draggable
 * @author zhujl
 */
define(function (require) {

    var lib = require('../helper/lib');
    var gui = require('../main');

    var body = $(document.body);
    var startX;
    var startY;
    var offsetX;
    var offsetY;

    var unselectable = gui.config.uiClassPrefix + '-unselectable';

    /**
     * 调用此方法，拖拽目标就开始跟着鼠标移动
     *
     * @param {Object} e 事件对象
     */
    function startDrag(e) {

        var options = e.data;
        var target = e.target;

        var ctrlMain = options.ctrl.main;

        // 判断是否点击在 cancel 区域
        if (options.cancel) {
            var cancel = ctrlMain.find(options.cancel)[0];
            if (cancel && lib.contains(cancel, target)) {
                return;
            }
        }

        // 判断是否点击在 handle 区域
        if (options.handle) {
            var handle = ctrlMain.find(options.handle)[0];
            if (handle && !lib.contains(handle, target)) {
                return;
            }
        }

        // 计算拖拽范围
        var containment = $(options.containment || document.body);
        var offset = containment.offset();

        options.rect = {
            left: offset.left,
            top: offset.top,
            right: offset.left + containment.prop('scrollWidth'),
            bottom: offset.top + containment.prop('scrollHeight')
        };

        // 计算一下宽高，避免 dragging 重复计算
        options.width = ctrlMain.width();
        options.height = ctrlMain.height();

        var ctrlOffset = ctrlMain.offset();

        startX = e.pageX;
        startY = e.pageY;
        offsetX = startX - ctrlOffset.left;
        offsetY = startY - ctrlOffset.top;

        var doc = lib.getDocument();
        doc.on('mousemove', options, dragging);
        doc.on('mouseup', options, stopDrag);

        body.addClass(unselectable);
    }

    /**
     * 正在拖拽
     *
     * @param {Object} 事件对象
     */
    function dragging(e) {
        var options = e.data;

        var x = e.pageX - offsetX;
        var y = e.pageY - offsetY;

        // 纠正范围
        var rect = options.rect;
        if (rect) {
            var temp;
            if (x < rect.left) {
                x = rect.left;
            }
            else if (x > (temp = rect.right - options.width)) {
                x = temp;
            }

            if (y < rect.top) {
                y = rect.top;
            }
            else if (y > (temp = rect.bottom - options.height)) {
                y = temp;
            }
        }

        // 限制方向
        var axis = options.axis;
        if (axis) {
            if (axis === 'x') {
                // 重置 y
                y = startY - offsetY;
            }
            else {
                x = startX - offsetX;
            }
        }

        options.ctrl.main.css({
            left: x,
            top: y
        });
    }

    function stopDrag() {
        var doc = lib.getDocument();

        doc.off('mousemove', dragging);
        doc.off('mouseup', stopDrag);
        body.removeClass(unselectable);
    }


    /**
     * 使得一个控件可拖拽
     *
     * @param {Object} options
     * @param {Control} options.ctrl 需要拖拽效果的控件
     * @param {HTMLElement=} options.containment 限制拖拽范围的容器，默认是 document.body
     * @param {string=} options.handle 触发拖拽的区域(css选择器)
     * @param {string=} options.cancel 不触发拖拽的区域(css选择器)
     * @param {string=} options.axis 限制方向，x 或 y
     */
    return function (options) {

        var ctrl = options.ctrl;
        var main = ctrl.main;

        main.attr('draggable', 'draggable');

        // 想拖拽，必须是绝对定位
        if (main.css('position') !== 'absolute') {
            main.css({
                position: 'absolute'
            });
        }

        main.on('mousedown', options, startDrag);
    };

});
