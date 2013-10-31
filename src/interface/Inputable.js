/**
 * @file Inputable
 * @author zhujl
 */
define(function (require) {

    var SuperClass = require('./Control');
    var lib = require('../helper/lib');
    var gui = require('../main');

    /**
     * 可输入控件
     *
     * @constructor
     * @param {Object} options
     */
    function Inputable(options) {
        SuperClass.apply(this, arguments);
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

            this.on('keyup', onkeyup);

            if (!lib.supportInputEvent) {
                this.on('propertychange', onpropertychange);
            }

            SuperClass.prototype.initStructure.apply(this, arguments);
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

    function onkeyup(e) {

        if (e.keyCode === 13) {

            /**
             * @event Inputable#submit
             */
            this.fire('submit');
        }
    }

    /**
     * 纠正低版本 IE
     */
    function onpropertychange(e) {
        var name = e.originalEvent.propertyName;
        if (name === 'value') {
            // IE 直接赋值也会触发事件...
            if (this.hasFocus()) {

                /**
                 * @event Inputable#input
                 */
                this.fire('input');

            }
        }
    }

    lib.inherits(Inputable, SuperClass);


    return Inputable;

});
