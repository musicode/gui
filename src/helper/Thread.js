/**
 * @file 线程
 * @author zhujl
 */
define(function (require) {

    'use strict';
    
    var Observable = require('../interface/Observable');
    var lib = require('./lib');

    /**
     * @constructor
     * @param {Object} options
     * @param {number} options.type 线程类型
     * @param {number} options.unit 一次处理的量
     * @param {number} options.interval 间隔时长
     */
    function Thread(options) {

        options.noDOM = true;
        Observable.call(this, options);

        var defaultOptions = Thread.defaultOptions;

        for (var key in defaultOptions) {
            this[key] = options[key] || defaultOptions[key];
        }

    }

    Thread.prototype = {

        /**
         * 启动线程
         *
         * @param {Array} data
         */
        start: function (data) {
            var me = this;
            var unit = this.unit;
            var interval = this.interval;

            function run(index) {
                var start = index * unit;
                index++;

                var end = Math.min(index * unit, data.length);
                var part = data.slice(start, end);

                if (part.length === 0) {

                    /**
                     * @event Thread#complete
                     */
                    me.fire('complete');

                    me.id = null;

                    return;
                }

                me.fire('step', { data: part });

                me.id = setTimeout(function () {
                    run(index);
                }, interval);
            }

            run(0);
        },

        /**
         * 中止线程
         */
        stop: function () {
            if (this.id) {
                clearTimeout(this.id);
                this.id = null;
            }
        }
    };


    // 渲染任务
    Thread.TYPE_RENDER = 'render';
    // 选择任务
    Thread.TYPE_SELECT = 'select';

    Thread.defaultOptions = {
        type: Thread.TYPE_RENDER,
        unit: 20,
        interval: 30
    };

    lib.inherits(Thread, Observable);

    return Thread;

});
