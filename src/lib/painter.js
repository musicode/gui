define(function (require) {

    var lib = require('./lib');

    /**
     * 设计目的
     *
     * 1. painter 按定义顺序执行
     * 2. 可多个属性公用一个 handler，因为会产生相互影响
     * 3. 可批量执行
     */

    /**
     * 负责 attribute
     */
    function attr(name, handler) {

        handler.type = 'attr';
    }

    /**
     * 负责 css
     */
    function css(name, handler) {

    }

    /**
     * 负责 innerHTML
     */
    function html() {

    }

    /**
     * dom 结构变化
     * @return {[type]} [description]
     */
    function dom() {

    }

    /**
     * 四大画笔
     *
     * @type {Object}
     */
    return {

        /**
         * 批量更新控件属性
         *
         * @param {Control} ctrl
         * @param {Object} properties
         * @return {Array.<Function>}
         */
        update: function (ctrl, properties) {

            var result = [ ];

            $.each(ctrl.constructor.painters, function (index, item) {

                var args = [ctrl];
                var nameList = item.name;
                var isChange = false;

                if (typeof nameList === 'string') {
                    nameList = [ nameList ];
                }

                $.each(nameList, function (index, name) {
                    var newValue = properties[name];
                    if (typeof item.check === 'function') {
                        newValue =
                        properties[name] = item.check(ctrl, newValue);
                    }

                    var oldValue = ctrl[name];

                    if (newValue !== undefined && newValue !== oldValue) {
                        isChange = true;
                        args.push(newValue);
                    }
                    else {
                        args.push(undefined);
                    }
                });

                if (isChange) {
                    result.push(function () {
                        item.painter.apply(null, args);
                    });
                }
            });

            return result;
        }
    };
});
