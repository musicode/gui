/**
 * @class CheckBoxGroup
 * @author zhujl
 */
define(function (require) {

    'use strict';
    
    var SuperClass = require('./interface/Control');
    var CheckBox = require('./CheckBox');
    var lib = require('./helper/lib');

    /**
     * 复选框组
     *
     * @constructor
     * @param {Object} options
     * @param {(HTMLElement | jQuery)=} options.main 主元素
     * @param {Array} options.datasource
     */
    function CheckBoxGroup(options) {
        SuperClass.apply(this, arguments);
    }

    CheckBoxGroup.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'CheckBoxGroup',

        /**
         * 初始化控件配置
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, CheckBoxGroup.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {
            this.checkBoxes = [ ];

            SuperClass.prototype.initStructure.apply(this, arguments);
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
        },

        /**
         * 获得选中的值
         *
         * @return {string}
         */
        getValue: function () {
            var result = [ ];
            for (var key in this.checkBoxes) {
                var checkBox = this.checkBoxes[key];
                if (checkBox.selected) {
                    result.push(checkBox.value);
                }
            }
            return result.join(',');
        }
    };

    CheckBoxGroup.defaultOptions = {

    };

    CheckBoxGroup.painter = {
        datasource: function (checkBoxGroup, datasource) {

            var checkBoxes = checkBoxGroup.checkBoxes;

            if (checkBoxes.length > 0) {
                $.each(checkBoxes, function (index, checkBox) {
                    checkBox.dispose();
                });
                checkBoxes.length = 0;
            }

            var main = checkBoxGroup.main;
            main.html('');

            $.each(datasource, function (index, options) {
                var checkBox = new CheckBox(options);
                checkBox.appendTo(main);
                checkBox.render();
            });
        }
    };

    lib.inherits(CheckBoxGroup, SuperClass);


    return CheckBoxGroup;

});
