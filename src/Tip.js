/**
 * @file Tip
 * @author zhujl
 */
define(function (require) {

    var SuperClass = require('./interface/Control');
    var Overlay = require('./interface/Overlay');
    var popup = require('./helper/popup');
    var lib = require('./helper/lib');
    var gui = require('./main');

    /**
     * 提示( 同一时间只展现一个Tip )
     *
     * @constructor
     * @param {Object} options
     * @param {HTMLElement} options.main
     * @param {string} options.content
     * @param {string} options.showBy 设置触发显示的方式：click over
     * @param {string} options.hideBy 设置触发隐藏的方式: blur out
     * @param {Object} options.position 浮层出现的位置, 可选值如下:
     *                                  lt: 左上
     *                                   t: 上
     *                                  rt: 右上
     *                                   l: 左
     *                                   r: 右
     *                                  lb: 左下
     *                                   b: 下
     *                                  rb: 右下
     * @param {number} options.width 提示层的宽度
     */
    function Tip(options) {
        SuperClass.apply(this, arguments);
    }

    Tip.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'Tip',

        /**
         * 初始化控件参数
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, Tip.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            if (!overlay) {
                createOverlay();
            }

            overlay.on('beforeshow', onbeforeshow, this);

            popup({
                trigger: this.main,
                overlay: overlay,
                showBy: this.showBy,
                hideBy: this.hideBy
            });
        }

    };

    Tip.defaultOptions = {
        showBy: 'over',
        hideBy: 'out'
    };

    Tip.painter = {
        width: function () {
            // 只是覆盖父类的方法
            // 因为这里的　width 用于浮层
        }
    }

    var overlay;

    /**
     * 创建 overlay 单例
     */
    function createOverlay() {
        overlay = new Overlay({
            global: true,
            type: 'tip-layer'
        });
        overlay.render();
    }

    /**
     * 因为 overlay 是共用的
     * 所以每次显示时, 都要以当前实例的配置进行调整
     */
    function onbeforeshow() {
        var align = Tip.positionMap[this.position];
        align.baseElement = this.main;

        overlay.setProperties({
            width: this.width,
            align: align
        });

        overlay.main.html(this.content);
    }

    /**
     * tip 浮层位置映射表
     *
     * @static
     * @type {Object}
     */
    Tip.positionMap = {
        lt: {
            base: {
                x: 0,
                y: 0
            },
            self: {
                x: '100%',
                y: '100%'
            }
        },
        t: {
            base: {
                x: '50%',
                y: 0
            },
            self: {
                x: '50%',
                y: '100%'
            }
        },
        rt: {
            base: {
                x: '100%',
                y: 0
            },
            self: {
                x: 0,
                y: '100%'
            }
        },

        l: {
            base: {
                x: 0,
                y: '50%'
            },
            self: {
                x: '100%',
                y: '50%'
            }
        },
        r: {
            base: {
                x: '100%',
                y: '50%'
            },
            self: {
                x: 0,
                y: '50%'
            }
        },

        lb: {
            base: {
                x: 0,
                y: '100%'
            },
            self: {
                x: '100%',
                y: 0
            }
        },

        b: {
            base: {
                x: '50%',
                y: '100%'
            },
            self: {
                x: '50%',
                y: 0
            }
        },
        rb: {
            base: {
                x: '100%',
                y: '100%'
            },
            self: {
                x: 0,
                y: 0
            }
        }
    };

    lib.inherits(Tip, SuperClass);


    return Tip;

});