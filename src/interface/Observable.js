/**
 * @file Observable
 * @author zhujl
 */
define(function (require) {

    'use strict';

    var lib = require('../lib/lib');
    var gui = require('../main');

    /**
     * 观察者对象
     *
     * 借用 jQuery 的事件模块
     * 事件由 main 属性负责
     *
     * @constructor
     * @param {Object} options
     * @param {(HTMLElement | jQuery)=} options.main
     */
    function Observable(options) {

        /**
         * 实例的 guid
         *
         * @type {string}
         */
        this.guid = lib.getGUID();

        /**
         * 主对象
         *
         * @type {jQuery}
         */
        this.main = getMain.call(this, options);

        gui[this.guid] = this;
    }

    Observable.prototype = {

        /**
         * 创建主对象
         *
         * @return {(HTMLElement | jQuery)}
         */
        createMain: function () {
            throw new Error('not implement createMain');
        },

        /**
         * 绑定事件, 支持 DOM 事件和自定义事件
         *
         * 如果不需要事件代理, 可写成 on(type, handler)
         *
         * @param {string} type 事件类型
         * @param {string=} selector DOM 事件用到的选择器, 一般用于事件代理
         * @param {Function} handler 事件处理函数
         * @param {Object=} scope handler 中的 this 指向, 默认是当前实例
         */
        on: function (type, selector, handler, scope) {

            if (typeof selector === 'function') {
                scope = handler;
                handler = selector;
                selector = null;
            }

            var guid = this.guid;
            var proxy = handler[guid];

            // 改写 this
            if (typeof proxy !== 'function') {
                proxy = $.proxy(handler, scope || this);
                handler[guid] = proxy;
            }

            // 加上命名空间
            type += '.' + guid;

            this.main.on(type, selector, proxy);
        },

        /**
         * 移除事件, 支持 DOM 事件和自定义事件
         *
         * 如果不需要事件代理, 可写成 off(type, handler)
         *
         * @param {string=} type 事件类型，如果未指定，表示移除所有事件
         * @param {string=} selector DOM 事件用到的选择器, 一般用于事件代理
         * @param {Function=} handler 事件处理函数
         */
        off: function (type, selector, handler) {
            if (typeof selector === 'function') {
                handler = selector;
                selector = null;
            }

            var main = this.main;
            var guid = this.guid;

            type += '.' + guid;

            // 如果确实指定了 handler
            if (handler) {
                var proxy = handler[guid];
                if (typeof proxy === 'function') {
                    main.off(type, selector, proxy);
                }
            }
            else {
                main.off(type, selector);
            }
        },

        /**
         * 绑定只触发一次的事件
         *
         * @param {string} type 事件类型
         * @param {string=} selector
         * @param {Function} handler 事件处理函数
         * @param {Object} scope
         */
        one: function (type, selector, handler, scope) {
            this.on(type, selector, function () {
                this.off(type, arguments.callee);
                return handler.apply(this, arguments);
            }, scope);
        },

        /**
         * 广播事件
         *
         * @param {string} type 事件类型
         * @param {Object=} data 事件数据
         */
        trigger: function (type, data) {
            type += '.' + this.guid;
            this.main.trigger(type, data);
        },

        /**
         * 销毁对象
         */
        dispose: function () {
            this.main.off();
        }
    };


    /**
     * 获得控件主对象
     *
     * 这是个 jQuery 对象，可负责事件通信
     *
     * @param {jQuery} main
     * @return {jQuery}
     */
    function getMain(options) {

        var main = options.main;

        if (!main) {
            main = this.createMain(options);
        }
        else {
            delete options.main;
        }

        if (!main.jquery) {
            main = $(main);
        }

        return main;
    }


    return Observable;

});
