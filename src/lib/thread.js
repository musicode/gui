/**
 * @file thread
 * @author zhujialu
 */
define(function (require, exports) {

    /**
     * 启用一个线程
     * 
     * @param {Object} options
     * @param {string} options.type 线程类型
     * @param {number} options.unit 每次处理多少数据
     * @param {number} options.interval 时间间隔
     * @param {Array} options.data 处理的数据
     * @param {Function} options.onfinish
     * @param {Function} options.onstep
     */
    exports.start = function (options) {

        var data = options.data;
        var unit = options.unit;
        var interval = options.interval;
        var onstep = options.onstep;

        function run(index) {
            var start = index * unit;

            index++;

            var end = Math.min(index * unit, data.length);
            var part = data.slice(start, end);

            if (part.length === 0) {

                if (typeof options.onfinish === 'function') {
                    options.onfinish();
                }

                options.task = null;

                return;
            }

            if (typeof onstep === 'function') {
                onstep(part);
            }

            options.task = setTimeout(function () {
                run(index);
            }, interval);
        }

        run(0);
    };

    /**
     * 停止线程
     * 
     */
    exports.stop = function (task) {
        clearTimeout(task);
    };

});