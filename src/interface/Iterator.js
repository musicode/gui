/**
 * @file Iterator
 * @author zhujl
 */
define(function (require) {

    var Observable = require('./Observable');
    var Inputable = require('./Inputable');
    var lib = require('../helper/lib')

    /**
     * 上下键元素遍历器
     * 需要支持上下键遍历时，
     * 只需要传入遍历的父元素即可
     *
     * @constructor
     * @param {Control} ctrl
     */
    function Iterator(ctrl) {

        var options = {
            main: ctrl.main
        };

        Observable.call(this, options);

        /**
         * 当前遍历的索引
         *
         * @type {number}
         */
        this.index = - 1;

        /**
         * 最大索引值
         *
         * @type {number}
         */
        this.maxIndex = 0;

        /**
         * 是否支持循环遍历
         *
         * @type {boolean}
         */
        this.loop = true;

        /**
         * 当前的状态
         * 0: 不可遍历
         * 1：可遍历
         *
         * @type {number}
         */
        this.status = 0;

        ctrl.on('keydown', onkeydown, this);
        ctrl.on('keyup', onkeyup, this);
    }

    Iterator.prototype = {

        /**
         * 开始遍历
         *
         * @param {boolean=} loop 是否循环遍历
         */
        start: function (loop) {
            this.status = 1;
            this.loop = typeof loop === 'boolean' ? loop : true;
        },

        /**
         * 重新开始
         *
         * @param {number} index
         */
        restart: function (index) {
            this.index = typeof index === 'number' ? index : -1;
        },

        /**
         * 回到上一个
         */
        prev: function () {
            var prevIndex = this.index;

            var currentIndex = prevIndex;
            currentIndex--;

            if (this.loop && currentIndex < 0) {
                currentIndex = this.maxIndex;
            }

            this.index = currentIndex;

            this.fire('enter', currentIndex);
            this.fire('leave', prevIndex);
        },

        /**
         * 到下一个
         */
        next: function () {
            var prevIndex = this.index;

            var currentIndex = prevIndex;
            currentIndex++;

            if (this.loop && currentIndex > this.maxIndex) {
                currentIndex = 0;
            }

            this.index = currentIndex;

            this.fire('enter', currentIndex);
            this.fire('leave', prevIndex);
        },

        /**
         * 停止遍历
         */
        stop: function () {
            this.status = 0;
            this.index = -1;
            stopRunner(this);
        }

    }

    // 按住上下键时遍历的速度，单位毫秒
    Iterator.SPEED = 100;

    function onkeydown(e) {
        if (this.status === 0) {
            return;
        }

        var keyCode = e.keyCode;

        var isUp = keyCode === lib.KEYCODE_UP;
        var isDown = keyCode === lib.KEYCODE_DOWN;

        if (!isUp && !isDown) {
            return;
        }
        var method = isUp ? 'prev' : 'next';

        if (!Inputable.isKeyPressed) {
            this[method]();
        }
        else if (this._timer == null) {
            startRunner(this, method);
        }

    }

    function onkeyup(e) {
        stopRunner(this);
    }

    function startRunner(iterator, method) {
        iterator._timer = setTimeout(function () {

            iterator[method]();
            startRunner(iterator, method);

        }, Iterator.SPEED);
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
