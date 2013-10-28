define(function (require, exports, module) {

    function p(s) {
        console.log(s);
    }

    /**
     * 配置项
     *
     * @type {Object}
     */
    exports.config = {
        uiClassPrefix: 'ui',
        iconClassPrefix: 'icon'
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

    /**
     * 初始化页面中的 ui
     */
    exports.init = function () {
        $('*[data-ui]').each(function () {
            var target = $(this);
            var options = target.data();
            var type = options.ui;

            if (type) {

                delete options.ui;
                options.main = target;

                require(['gui/' + type], function (UI) {
                    var ui = new UI(options);
                    ui.render();
                });
            }
        });
    };

    /**
     * 混合多个类
     *
     * @param  {[type]} options [description]
     * @param  {[type]}         [description]
     * @return {[type]}         [description]
     */
    exports.mix = function () {
        var MainClass = arguments[0];
        var instance = new MainClass();

    };

});
