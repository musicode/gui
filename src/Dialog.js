/**
 * @file Dialog
 * @author zhujl
 */
define(function (require) {

    var SuperClass = require('./interface/Overlay');
    var Draggable = require('./interface/Draggable');
    var lib = require('./helper/lib');
    var gui = require('./main');

    var Mask = require('./Mask');
    var Button = require('./Button');

    /**
     * 对话框
     *
     * @constructor
     * @param {Object} options
     * @param {string} options.title 对话框标题
     * @param {string} options.content 对话框内容
     * @param {number} options.width 对话框整体宽度
     * @param {boolean} options.modal 窗口是否模态
     * @param {number=} options.x 窗口出现的 x 位置
     * @param {number=} options.y 窗口出现的 y 位置
     * @param {boolean=} options.closeOnHide 是否隐藏时销毁控件
     */
    function Dialog(options) {
        SuperClass.apply(this, arguments);
        this.on('beforeshow', beforeShow);
    }

    Dialog.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'Dialog',

        /**
         * 初始化控件参数
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, Dialog.defaultOptions);

            options.global = true;
            options.align = {
                baseElement: document.body,
                base: {
                    x: options.x,
                    y: options.y
                },
                self: {
                    x: options.x === '50%' ? '50%' : '0',
                    y: options.y === '50%' ? '50%' : '0'
                }
            };

            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化控件 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            var Class = this.constructor;

            var header = Class.headerTemplate(this.title);
            var body = Class.bodyTemplate(this.content);
            var footer = Class.footerTemplate(this.buttons);

            var main = this.main;
            main.html(header + body + footer);

            if (footer) {
                var footer = main.find('.' + Class.CLASS_FOOTER);
                Class.buttonTemplate(this, footer);
            }

            this.on('click', '.' + Class.CLASS_CLOSE, this.hide);
            this.on('afterdispose', afterDispose);

            SuperClass.prototype.initStructure.apply(this, arguments);
        },

        /**
         * 创建控件主元素
         *
         * @protected
         * @override
         * @return {HTMLElement}
         */
        createMain: function () {
            return document.createElement('div');
        },

        /**
         * 获得底部的按钮，按 buttons 参数的 key 获取
         *
         * @param {string} name
         * @return {ui.Button}
         */
        getButton: function (name) {
            return this.buttons && this.buttons[name];
        }

    };

    Dialog.defaultOptions = {
        title: '',
        content: '',
        modal: true,
        draggable: true,
        hidden: true,
        closeOnHide: false,
        y: '50%',
        x: '50%'
    };

    /**
     * header 的模版方法
     *
     * @inner
     * @param {string} title
     * @return {string}
     */
    Dialog.headerTemplate = function (title) {
        var header = '';
        if (title) {
            header = '<div class="' + Dialog.CLASS_HEADER + '">'
                   +    '<h1 class="' + Dialog.CLASS_TITLE + '">'
                   +        title
                   +    '</h1>'
                   +    '<i class="' + Dialog.CLASS_CLOSE + '">&times;</i>'
                   + '</div>';
        }
        return header;
    };

    /**
     * body 的模版方法
     *
     * @param {string} content
     * @return {string}
     */
    Dialog.bodyTemplate = function (content) {

        var body = '<div class="' + Dialog.CLASS_BODY + '">'
                 +    content
                 + '</div>';

        return body;
    };

    /**
     * footer 的模版方法
     *
     * @param {Object} dialog
     * @return {string}
     */
    Dialog.footerTemplate = function (buttons) {

        var footer = '';

        if (lib.keys(buttons).length > 0) {
            footer = '<div class="' + Dialog.CLASS_FOOTER + '"></div>';
        }

        return footer;
    };

    /**
     * 生成按钮的模版
     *
     * @param {ui.Dialog} dialog
     * @param {jQuery} footer
     */
    Dialog.buttonTemplate = function (dialog, footer) {

        var buttons = dialog.buttons;

        for (var key in buttons) {
            var handler = buttons[key];

            var btn = new Button({
                label: key
            });
            btn.on('click', function () {
                handler.call(this, dialog);
            });
            btn.appendTo(footer);
            btn.render();

            buttons[key] = btn;
        }
    };

    Dialog.painter = {

        hidden: function (dialog, hidden) {
            if (hidden) {
                if (dialog.stage > lib.LifeCycle.RENDERED) {
                    if (dialog.closeOnHide) {
                        dialog.dispose();
                        return;
                    }
                    else if (dialog.modal) {
                        Mask.remove(dialog);
                    }
                }
            }
            SuperClass.painter.hidden(dialog, hidden);
        },

        draggable: function (dialog, draggable) {

            if (draggable) {
                var Class = dialog.constructor;

                Draggable({
                    ctrl: dialog,
                    handle: '.' + Class.CLASS_HEADER
                });
            }
        },

        title: function (dialog, title) {
            var Class = dialog.constructor;
            var header = $('.' + Class.CLASS_HEADER, dialog.main);
            var hasHeader = header.length !== 0;
            var hiddenClass = gui.CLASS.HIDDEN;

            if (title) {
                if (hasHeader) {
                    header.removeClass(hiddenClass);
                    header.find('.' + Class.CLASS_TITLE).html(title);
                }
                else {
                    var html = Class.headerTemplate(title);
                    header = $(html);
                    header.prependTo(dialog.main);
                }
            }
            else if (hasHeader) {
                header.addClass(hiddenClass);
            }
        },

        content: function (dialog, content) {
            var Class = dialog.constructor;
            var body = $('.' + Class.CLASS_BODY, dialog.main);

            body.html(content);
        }

    };

    /**
     * 响应 onbeforeshow 事件
     */
    function beforeShow() {
        // Dialog 感觉很少人会写
        // 1. dialog.render()
        // 2. dialog.show()
        //
        // 更多的是直接 dialog.show()
        if (this.stage < lib.LifeCycle.RENDERED) {
            this.render();
        }

        if (this.modal) {
            Mask.add(this);
        }
    }

    function afterDispose() {
        var buttons = this.buttons;
        if (buttons) {
            for (var key in buttons) {
                buttons[key].dispose();
            }
        }

        this.main.remove();
    }

    var classPrefix = gui.config.uiClassPrefix + '-dialog-';

    Dialog.CLASS_HEADER = classPrefix + 'header';
    Dialog.CLASS_TITLE = classPrefix + 'title';
    Dialog.CLASS_CLOSE = classPrefix + 'close';

    Dialog.CLASS_BODY = classPrefix + 'body';
    Dialog.CLASS_FOOTER = classPrefix + 'footer';


    lib.inherits(Dialog, SuperClass);


    Dialog.alert = function (options) {
        var properties = {
            x: '50%',
            y: '50%',
            title: '提示',
            draggable: false,
            closeOnHide: true,
            buttons: {
                '确认': function (dialog) {
                    dialog.hide();
                }
            }
        };

        $.extend(properties, options);

        var dialog = new Dialog(properties);
        dialog.show();

        return dialog;
    };

    Dialog.confirm = function (options) {
        var properties = {
            x: '50%',
            y: '50%',
            title: '确认',
            draggable: false,
            closeOnHide: true,
            buttons: {
                '确认': function (dialog) {
                    dialog.hide();
                },
                '取消': function (dialog) {
                    dialog.hide();
                }
            }
        };

        $.extend(properties, options);

        var dialog = new Dialog(properties);
        dialog.show();

        return dialog;
    };

    return Dialog;

});
