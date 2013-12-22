/**
 * @file  字符串相关工具方法
 * @author  zhujl
 */
define(function (require, exports) {

    /**
     * 获得单个字符的 UTF-8 长度
     *
     * @private
     * @param {string} x
     * @return {number}
     */
    function getCharUTF8Length(x) {
        var code = x.charCodeAt(0);

        if ((code & ~0x7F) == 0) {
            return 1;
        }

        if ((code & ~0x07FF) == 0) {
            return 2;
        }

        if ((code & ~0xFFFF) == 0) {
            return 3;
        }

        return 4;
    }

    /**
     * 遍历字符串
     *
     * @private
     * @param {string} str
     * @param {Function} callback (length, index)
     */
    function traverse(str, callback) {
        var size = 0;

        for (var i = 0, len = str.length; i < len; i++) {

            size += Math.floor(
                (getCharUTF8Length(str.charAt(i)) + 1) / 2
            );

            if (callback(size, i + 1) === false) {
                break;
            }
        }
    }

    /**
     * 计算字符串的 UTF-8 长度
     *
     * 英文算 1 个字符
     * 中文算 2 个字符
     *
     * @param {string} str
     * @return {number}
     */
    exports.getUTF8Length = function (str) {
        var result;

        traverse(str,
        function (length, index) {
            result = length;
        });

        return result;
    };



    /**
     * 截断字符串（英文长度为 1，汉字为 2)
     *
     * @param  {string} str 需要截断的字符串
     * @param  {number} length 截断字数
     * @param  {string} suffix 截断后缀，默认是 ...
     * @return {string}
     */
    exports.truncate = function (str, length, suffix) {

        var result = '';

        traverse(str,
        function (len, index) {
            if (len > length) {
                return false;
            }
            result = str.substr(0, index);
        });

        return result + (suffix || '...');
    };

});