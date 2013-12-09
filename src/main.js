define(function (require, exports, module) {

    'use strict';

    /**
     * 配置项
     *
     * @type {Object}
     */
    exports.config = {
        uiClassPrefix: 'ui',
        iconClassPrefix: 'icon',
        scrollbarWidth: 6
    };

    var classPrefix = exports.config.uiClassPrefix + '-';

    /**
     * 通用 class
     *
     * @type {Object}
     */
    exports.CLASS = {
        DISABLED: classPrefix + 'disabled',
        HIDDEN: classPrefix + 'hidden',
        SELECTED: classPrefix + 'selected',
        ACTIVE: classPrefix + 'active',
        OVERFLOW: classPrefix + 'overflow',
        BREAKLINE: classPrefix + 'breakline'
    };

    exports.create = function (type, options) {
        require(['gui/' + type], function (UI) {
            var ui = new UI(options);
            ui.render();
        });
    };

    /**
     * 初始化页面中的 ui
     */
    exports.render = function (container) {

        var array = this.parse(container);

        $.each(array, function (index, options) {
            var type = options.type;
            delete options.type;

            exports.create(type, options);
        });

    };

    /**
     * 解析模版中的 ui
     *
     * @param {HTMLElement} container
     * @param {Array}
     */
    exports.parse = function (container) {

        // 有两种标签书写方式:
        // 1. <div data-ui="type:Button;label:submit;">
        // 2. <div data-type="Button" data-label="submit">

        var array = [ ];

        // 先处理第一种
        $('*[data-ui]', container).each(function () {
            var target = $(this);
            var options = { };

            var value = target.data('ui');
            $.each(value.split(';'), function (index, part) {
                var pairs = part.split('=');
                if (pairs.length === 2) {
                    options[pairs[0]] = pairs[1];
                }
            });

            if (options.type) {
                options.main = target;
                array.push(options);
            }
        });

        // 处理第二种
        $('*[data-type]', container).each(function () {
            var target = $(this);
            var options = target.data();

            options.main = target;
            array.push(options);
        });

        return array;
    };

});
