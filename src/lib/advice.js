/**
 * @file 拦截方法
 * @author zhujl
 */
define(function (require, exports) {

    /**
     * 在方法执行前后进行拦截
     *
     * 1. 可拦截对象的方法，如 before(obj, 'setValue', new Function());
     * 2. 可拦截单纯的函数，如 before(setValue, newFunction());
     */

    /**
     * 在方法执行前进行拦截
     *
     * @param {(Object|Function)} target 拦截的对象或函数
     * @param {?string} name 如果 target 是 Object，name 表示它的属性名
     * @param {Function} before
     * @return {Function}
     */
    exports.before = function (target, name, before) {
        return exports.around(target, name, before);
    };

    /**
     * 在方法执行后进行拦截
     *
     * @param {(Object|Function)} target 拦截的对象或函数
     * @param {?string} name 如果 target 是 Object，name 表示它的属性名
     * @param {Function} after
     * @return {Function}
     */
    exports.after = function (target, name, after) {
        return exports.around(target, name, null, after);
    };

    /**
     * 在方法执行前后进行拦截
     *
     * @param {(Object|Function)} target 拦截的对象或函数
     * @param {?string} name 如果 target 是 Object，name 表示它的属性名
     * @param {Function} before
     * @param {Function} after
     * @return {Function}
     */
    exports.around = function (target, name, before, after) {
        var origin;

        if (typeof target === 'function') {
            after = before;
            before = name;
            origin = target;
        }
        else {
            origin = target[name];
        }

        var fake = function () {
            if (typeof before === 'function') {
                before();
            }
            var result = origin.apply(this, arguments);
            if (typeof after === 'function') {
                after();
            }
            return result;
        };

        if (typeof target === 'function') {
            return fake;
        }
        else {
            return target[name] = fake;
        }
    };

});
