/**
 * @file AjaxUploader
 * @author zhujl
 */
define(function (require) {

    var SuperClass = require('../interface/Control');
    var Observable = require('../interface/Observable');
    var lib = require('./lib');

    /**
     * Ajax 上传
     *
     * @constructor
     * @param {Object} options
     * @param {string} options.action 上传路径
     * @param {Object} options.data 请求参数
     * @param {string} options.accept 接受的格式
     */
    function AjaxUploader(options) {
        SuperClass.apply(this, arguments);
    }

    AjaxUploader.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'AjaxUploader',

        /**
         * 创建控件主元素
         *
         * @protected
         * @override
         * @param {Object} options
         * @return {HTMLElement}
         */
        createMain: function (options) {

            var html = '<input type="file"';

            if (options.accept) {
                html += ' accept=' + options.accept;
            }

            html += ' />';

            return lib.createElement(html);
        },

        /**
         * 初始化 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {
            this.on('change', changeFile);
            SuperClass.prototype.initStructure.apply(this, arguments);
        },

        /**
         * 获得已选文件
         *
         * @return {Object}
         */
        getFile: function () {
            var file = this.main[0].files[0];
            if (file) {
                return getFileInfo(file);
            }
        },

        /**
         * 上传文件
         */
        startUpload: function () {

            var file = this.main[0].files[0];
            var postData = new FormData();
            // 和 swfupload 保持一致
            // 因为 linux 下这个值没法改
            postData.append('Filedata', file);

            // 请求参数
            var data = this.data;
            if (data) {
                for (var key in data) {
                    postData.append(key, data[key]);
                }
            }

            var xhr = new XMLHttpRequest();
            xhr.open('post', this.action, true);

            var uploader = this;
            var upload = new Observable({
                main: xhr.upload
            });

            upload.on('loadstart', uploadStart, this);
            upload.on('progress', uploadProgress, this);

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {

                    if (xhr.status == 200) {
                        uploadSuccess.call(uploader);
                    }
                    else {
                        uploadFail.call(uploader);
                    }

                    // 解绑事件
                    upload.dispose();
                    uploadComplete.call(uploader);

                    xhr.onreadystatechange = null;
                }
            };

            xhr.send(postData);
            this.xhr = xhr;
        },

        stopUpload: function () {
            if (this.xhr) {
                this.xhr.abort();
                delete this.xhr;
            }
        }

    };

    function changeFile() {
        this.fire('upload-change');
    }

    /**
     * 开始上传时触发
     */
    function uploadStart() {

        /**
         * @event AjaxUploader#upload-start
         */
        this.fire('upload-start');
    }

    function uploadComplete(e) {

        /**
         * @event AjaxUploader#upload-complete
         */
        this.fire('upload-complete');
    }

    function uploadProgress(e) {

        if (e.lengthComputable) {

            /**
             * @event AjaxUploader#upload-progress
             * @param {Object} e 事件对象
             * @param {number} e.loaded 已上传大小
             * @param {number} e.total 总大小
             */
            this.fire(
                'upload-progress',
                {
                    uploaded: e.loaded,
                    total: e.total
                }
            );
        }
    }

    /**
     * 上传成功
     */
    function uploadSuccess() {

        /**
         * @event AjaxUploader#upload-success
         * @param {Object} e 事件对象
         * @param {string} e.response 返回的数据
         */
        this.fire(
            'upload-success',
            {
                response: this.xhr.responseText
            }
        );
    }

    /**
     * 上传失败
     */
    function uploadFail(e) {

        /**
         * @event AjaxUploader#upload-fail
         */
        this.fire('upload-fail');
    }

    /**
     * 获得对外格式一致的文件对象
     *
     * @return {Object}
     */
    function getFileInfo(file) {
        var name = file.name;
        var segments = name.split('.');
        var type = segments.length > 0 ? segments.pop() : '';

        return {
            name: name,
            type: type,
            size: file.size
        };
    }

    lib.inherits(AjaxUploader, SuperClass);


    return AjaxUploader;

});
