/**
 * @class Panel
 * @author zhujl
 */
define(function (require) {

    'use strict';

    var SuperClass = require('./interface/Control');
    var lib = require('./lib/lib');

    /**
     * 面板
     *
     * @constructor
     * @param {Object} options
     * @param {string} options.content
     */
    function Panel(options) {
        SuperClass.apply(this, options);
    }

    Panel.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'Panel'

    };

    Panel.painters = [

        {

            name: 'content',
            painter: function (panel, content) {
                panel.main.html(content);
            }
        }
    ];


    lib.inherits(Panel, SuperClass);

    return Panel;

});
