/**
 * @file Range
 * @author zhujl
 */
define(function (require) {

    /**
     * @constructor
     * @param {number} start 开始位置
     * @param {number} end 结束位置
     * @param {string} text 区间范围对应的文本
     */
    function Range(start, end, text) {
        // 开始位置
        this.start = start;
        // 结束位置
        this.end = end;
        // 区间的文本
        this.text = text;
    }

    Range.prototype = {

        /**
         * 替换 Range 内的文本
         *
         * @param {TextBox} input
         * @param {string} text
         */
        replaceText: function(input, text) {
            var value = input.getValue();
            value = value.substring(0, this.start) + text + value.substr(this.end);
            input.setValue(value);
        },

        /**
         * 删除 Range 内的文本
         *
         * @param {TextBox} input
         */
        deleteText: function(input) {
            this.replaceText(input, '');
        }
    };

    /**
     * 创建一个 Range 对象
     *
     * @param {HTMLElement} element <input> 或 <textarea> 元素
     * @return {Range}
     */
    Range.create = function(element) {

        var value = element.value;
        var start, end, text;

        if ('selectionStart' in element) {

            start = element.selectionStart;
            end = element.selectionEnd;

        } else {

            var doc = element.ownerDocument
            // 当前选区
            var activeRange = doc.selection.createRange();
            var len = activeRange.text.length;
            var offset = 0;
            var range;

            if (element.tagName === 'INPUT') {
                range = element.createTextRange();
                range.setEndPoint('StartToStart', activeRange);

                while (range.moveStart('character', -1) !== 0) {
                    offset++;
                }
            } else {
                range = doc.body.createTextRange();
                range.moveToElementText(element);

                while (range.compareEndPoints('StartToStart', activeRange) < 0
                    && activeRange.moveStart('character', -1) !== 0
                ) {
                    offset++;
                }
            }

            start = offset;
            end = start + len;
        }

        text = value.substring(start, end);

        return new Range(start, end, text);
    };

    return Range;

});
