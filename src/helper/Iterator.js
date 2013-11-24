/**
 * @file Iterator
 * @author zhujl
 */
define(function (require) {

    'use strict';
    
    var Observable = require('../interface/Observable');
    var lib = require('../lib/lib');

    /**
     * 上下键元素遍历器
     * 需要支持上下键遍历时，
     * 只需要传入遍历的父元素即可
     *
     * @constructor
     * @param {Object} options
     * @param {number=} options.index 当前索引值
     * @param {number=} options.min 最小索引值, 如 0 表示最小值为第一个
     * @param {number=} options.max 最大索引值
     * @param {boolean=} options.loop 是否支持循环遍历
     */
    function Iterator(options) {

        Observable.call(this, { });

        for (var key in options) {
            this[key] = options[key];
        }
    }

    Iterator.prototype = {

        /**
         * 开始遍历
         *
         * @param {number} index 当前索引
         * @param {number} min 最小索引
         * @param {number} max 最大索引
         */
        start: function (index, min, max) {
            this.index = index;
            this.min = min;
            this.max = max;

            var doc = lib.getDocument();
            var data = { iterator: this };
            doc.on('keydown', data, onkeydown);
            doc.on('keyup', data, onkeyup);
        },

        /**
         * 重新开始
         *
         * @param {number} index
         */
        restart: function (index) {
            this.index = typeof index === 'number'
                       ? index
                       : this.min;
        },

        /**
         * 回到上一个
         */
        prev: function () {

            var currentIndex = this.index;
            var prevIndex = currentIndex;

            currentIndex--;

            if (this.loop && currentIndex < this.min) {
                currentIndex = this.max;
            }

            if (this.inRange(currentIndex)) {
                this.index = currentIndex;
                this.fire('enter', currentIndex);
            }

            if (this.inRange(prevIndex)) {
                this.fire('leave', prevIndex);
            }
        },

        /**
         * 到下一个
         */
        next: function () {

            var currentIndex = this.index;
            var prevIndex = currentIndex;

            currentIndex++;

            if (this.loop && currentIndex > this.max) {
                currentIndex = this.min;
            }

            if (this.inRange(currentIndex)) {
                this.index = currentIndex;
                this.fire('enter', currentIndex);
            }

            if (this.inRange(prevIndex)) {
                this.fire('leave', prevIndex);
            }
        },

        /**
         * 停止遍历
         */
        stop: function () {
            stopRunner(this);

            var doc = lib.getDocument();
            doc.off('keydown', onkeydown);
            doc.off('keyup', onkeyup);
        },

        /**
         * index 是否在合法范围内
         *
         * @param {number} index
         * @return {boolean}
         */
        inRange: function (index) {
            return index >= this.min && index <= this.max;
        }
    }

    /**
     * 按住上下键时遍历的速度，单位毫秒
     */
    var SPEED = 50;

    var action = { };
    action[lib.KEYCODE_UP] = 'prev';
    action[lib.KEYCODE_DOWN] = 'next';

    function onkeydown(e) {

        var keyCode = e.keyCode;
        var method = action[keyCode];

        if (method) {
            var iterator = e.data.iterator;

            if (lib.keyPressed == null) {
                iterator[method]();
            }
            else if (iterator._timer == null) {
                startRunner(iterator, method);
            }
        }
    }

    function onkeyup(e) {
        var iterator = e.data.iterator;
        stopRunner(iterator);
    }

    function startRunner(iterator, method) {
        iterator._timer = setTimeout(function () {

            iterator[method]();
            startRunner(iterator, method);

        }, SPEED);
    }

    function stopRunner(iterator) {
        if (iterator._timer) {
            clearTimeout(iterator._timer);
            delete iterator._timer;
        }
    }


    lib.inherits(Iterator, Observable);


    return Iterator;

});
