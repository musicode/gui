/**
 * @file Inputable
 * @author zhujl
 */
define(function (require) {

    var Control = require('./Control');
    var lib = require('../helper/lib');
    var gui = require('../main');

    /**
     * 可输入控件
     *
     * @constructor
     * @param {Object} options
     */
    function Inputable(options) {
        Control.apply(this, arguments);
    }

    Inputable.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'Inputable',

        /**
         * 初始化控件 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            this.on('keydown', onkeydown);
            this.on('keyup', onkeyup);

            if (!supportInputEvent) {
                this.on('propertychange', onpropertychange);
            }

            Control.prototype.initStructure.apply(this, arguments);
        },

        /**
         * 输入框聚焦
         */
        focus: function () {
            this.main.focus();
        },

        /**
         * 输入框失焦
         */
        blur: function () {
            this.main.blur();
        },

        /**
         * 输入框是否是失焦状态
         *
         * @return {boolean}
         */
        hasFocus: function () {
            var element = this.main[0];
            var activeElement = element.ownerDocument.activeElement;

            return activeElement === element;
        }
    };

    // 检测是否支持 input 事件
    var input = document.createElement('input');
    var supportInputEvent = 'oninput' in input;
    input = null;

    /**
     * 是否正在长按某个键
     *
     * @static
     * @type {boolean}
     */
    Inputable.isKeyPressed = false;

    function onkeydown(e) {
        if (!Inputable.isKeyPressed) {
            Inputable.isKeyPressed = true;
        }
    }

    function onkeyup(e) {

        Inputable.isKeyPressed = false;

        if (e.keyCode === 13) {

            /**
             * @event Inputable#submit
             */
            this.fire('submit');
        }
    }

    function onpropertychange(e) {
        var name = e.originalEvent.propertyName;

        if (name === 'value') {
            // IE 直接赋值也会触发事件...
            if (this.hasFocus()) {
                this.fire('input');
            }
        }
    }

    lib.inherits(Inputable, Control);


    return Inputable;

});
