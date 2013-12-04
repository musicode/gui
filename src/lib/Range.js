/**
 * @file 操作 input 或 textarea 的选区
 * @author zhujl
 */
define(function (require) {

    /**
     * 封装 IE 的 TextRange 
     */
    function TextRange(element) {
        this.element = element;
    }

    TextRange.prototype = {

        constructor: TextRange,
        
        /**
         * 获得选区开始位置
         * 
         * @return {number}
         */
        getStart: function () {
            var activeRange = document.selection.createRange();
            if (activeRange.parentElement() !== this.element) {
                return;
            }

            var range = activeRange.duplicate();
            try {
                range.moveToElementText(this.element);
            }
            catch (e) { }

            var start = 0;

            if (this.element.tagName === 'INPUT') {
                range.setEndPoint('StartToStart', activeRange);

                while (range.moveStart('character', -1) !== 0) {
                    start++;
                }
            }
            else {
                while (range.compareEndPoints('StartToStart', activeRange) < 0
                    && activeRange.moveStart('character', -1) !== 0
                ) {
                    start++;
                }
            }

            return start;
        },

        /**
         * 获取选区结束位置
         *
         * @return {number}
         */
        getEnd: function () {
            var start = this.getStart();
            var text = this.getText();
            return start + text.length;
        },

        /**
         * 设置选区位置
         * 
         * @param {number} start 开始位置
         * @param {number} end 结束位置
         */
        setRange: function (start, end) {
            var range = this.element.createTextRange();

            // 重置到开始位置
            range.collapse(true);

            range.moveStart('character', start);
            range.moveEnd('character', end - 1);
            range.select();
        },

        /**
         * 获取选区文本
         * 
         * @return {string}
         */
        getText: function () {
            var range = document.selection.createRange();
            if (range.parentElement() !== this.element) {
                return '';
            }

            var text = range.text;
            return typeof text === 'string' ? text : String(text);
        },

        /**
         * 设置选区文本
         *
         * @param {string} text
         */
        setText: function (text) {
            var value = this.element.value;
            var start = this.getStart();
            var end = this.getEnd();

            this.element.value = value.substring(0, start)
                               + text
                               + value.substr(end);
        }
    };





    /**
     * 封装标准浏览器的 Range
     */
    function Range(element) {
        this.element = element;
    }

    Range.prototype = {

        constructor: Range,
        
        /**
         * 获得选区开始位置
         * 
         * @return {number}
         */
        getStart: function () {
            return this.element.selectionStart;
        },

        /**
         * 获取选区结束位置
         *
         * @return {number}
         */
        getEnd: function () {
            return this.element.selectionEnd;
        },

        /**
         * 设置选区位置
         * 
         * @param {number} start 开始位置
         * @param {number} end 结束位置
         */
        setRange: function (start, end) {
            this.element.setSelectionRange(start, end);
        },

        /**
         * 获取选区文本
         * 
         * @return {string}
         */
        getText: function () {
            var value = this.element.value;
            var start = this.getStart();
            var end = this.getEnd();

            return value.substring(start, end);
        },

        /**
         * 设置选区文本
         *
         * @param {string} text
         */
        setText: function (text) {
            var value = this.element.value;
            var start = this.getStart();
            var end = this.getEnd();

            this.element.value = value.substring(0, start)
                               + text
                               + value.substr(end);
        }
    };


    if (window.getSelection) {
        return Range;
    }
    else {
        return TextRange;
    }
});