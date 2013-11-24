/**
 * @file Mask
 * @author zhujl
 */
define(function (require) {

    'use strict';
    
    var SuperClass = require('./interface/Control');
    var lib = require('./lib/lib');

    /**
     * 遮罩
     *
     * @constructor
     * @param {Object} options
     * @param {number=} options.z
     */
    function Mask(options) {
        SuperClass.apply(this, arguments);
    }

    Mask.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'Mask',

        /**
         * 初始化控件参数
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, Mask.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 创建控件主元素
         *
         * @protected
         * @override
         * @return {HTMLElement}
         */
        createMain: function () {
            return document.createElement('div');
        }

    };

    Mask.defaultOptions = {
        z: 1000
    };

    lib.inherits(Mask, SuperClass);


    // 遮罩是个单例
    var instance = new Mask();
    instance.render();

    // 添加遮罩功能的控件
    var list = [ ];

    /**
     * 给控件添加一个背景遮罩
     *
     * @param {ui.Control} ctrl
     */
    Mask.add = function (ctrl) {

        list.push(ctrl);

        // 如果 ctrl 不在 body 下
        // 先把它移到 body 下
        var body = document.body;
        var ctrlMain = ctrl.main;
        var maskMain = instance.main;

        var maskInBody = maskMain.parent().is(body);
        if (!maskInBody) {
            instance.appendTo(body);
        }

        ctrl.appendTo(body);

        // 计算层级关系，遮罩位于控件的下方
        var z = instance.z + list.length - 1;
        maskMain.css('z-index', z);
        ctrlMain.css('z-index', z);

        ctrl.one('beforedispose', function () {
            Mask.remove(ctrl);
        });
    };


    /**
     * 销毁 add 过遮罩的控件时，需要同时移除掉遮罩
     *
     * @param {ui.Control} ctrl
     */
    Mask.remove = function (ctrl) {

        for (var len = list.length - 1; len >= 0; len--) {
            if (list[len] === ctrl) {
                list.splice(len, 1);
            }
        }

        var maskMain = instance.main;

        len = list.length;

        if (len === 0) {
            var body = document.body;
            var maskElement = maskMain[0];

            if (maskElement.parentNode === body) {
                body.removeChild(maskElement);
            }
        }
        else {
            var zIndex = instance.z;
            var z = Math.max(zIndex, zIndex + len - 1);
            maskMain.css('z-index', z);
        }
    };

    return Mask;

});
