/**
 * @file FlashUploader
 * @author zhujl
 */
define(function (require) {

    'use strict';
    
    require('../lib/swfupload/swfupload');
    require('../lib/swfupload/plugins/swfupload.cookies');

    var SuperClass = require('../interface/Control');
    var lib = require('../lib/lib');

    /**
     * flash 上传
     *
     * @constructor
     * @param {Object} options
     * @param {string} options.action 上传路径
     * @param {Object} options.data 上传参数
     * @param {string} options.accept 接受的文件格式, 如 'jpg,png,gif'
     */
    function FlashUploader(options) {
        SuperClass.apply(this, arguments);
    }

    FlashUploader.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'FlashUploader',

        /**
         * 初始化控件 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {
            var options = getSWFUploadOptions(this);
            this.swfUpload = new SWFUpload(options);

            this.one('beforedispose', beforeDispose);
        },

        /**
         * 获得已选文件
         *
         * @return {Object}
         */
        getFile: function () {
            var file = this.swfUpload.getFile();
            if (file) {
                return getFileInfo(file);
            }
        },

        /**
         * 开始上传
         */
        startUpload: function () {
            this.swfUpload.startUpload();
        },

        /**
         * 停止上传
         */
        stopUpload: function () {
            this.swfUpload.stopUpload();
        }
    };

    /**
     * 获得 SWFUpload 的初始化参数
     *
     * @param {FlashUploader} flashUplader
     * @return {Object}
     */
    function getSWFUploadOptions(flashUploader) {

        var ret = {
            upload_url: flashUploader.action,
            button_placeholder_id: flashUploader.main.prop('id'),
            flash_url: '/src/lib/swfupload/swfupload.swf',
            debug: false
        };

        var accept = flashUploader.accept;
        if (typeof accept === 'string') {

            var parts = accept.split(',');
            var fileTypes = [ ];

            $.each(parts, function (index, extname) {
                extname = $.trim(extname);
                fileTypes.push('*.' + extname);
            });

            if (fileTypes.length > 0) {
                // 格式为 '*.jpg;*.png;'
                ret.file_types = fileTypes.join(';');
            }
        }

        if (flashUploader.data) {
            ret.post_params = flashUploader.data;
        }

        ret.file_queue_limit = 0;
        ret.file_upload_limit = 0;


        // 设置按钮
        ret.button_cursor = SWFUpload.CURSOR.HAND;
        ret.button_window_mode = 'transparent';
        ret.button_width = '100%';
        ret.button_height = '100%';
        ret.button_action = SWFUpload.BUTTON_ACTION.SELECT_FILE;

        // 文件选择对话框关闭
        ret.file_dialog_complete_handler = changeFile;

        // 开始上传
        ret.upload_start_handler = uploadStart;

        // 文件上传中
        ret.upload_progress_handler = uploadProgress;

        // 文件上传成功
        ret.upload_success_handler = uploadSuccess;

        // 文件上传出错
        ret.upload_error_handler = uploadFail;

        // 文件上传完成
        // 在 upload_error_handler 或者 upload_success_handler 之后触发
        ret.upload_complete_handler = uploadComplete;

        ret.custom_settings = {
            uploader: flashUploader
        };

        return ret;
    };

    function changeFile(selectedFileNum, selectedQueuedFileNum, queuedFileNum) {
        var uploader = this.customSettings.uploader;
        if (queuedFileNum > 1) {
            uploader.swfUpload.cancelUpload();
        }
        uploader.fire('upload-change');
    }

    function uploadStart(file) {
        var uploader = this.customSettings.uploader;
        uploader.fire('upload-start');
    }

    function uploadComplete(file) {
        var uploader = this.customSettings.uploader;
        uploader.fire('upload-complete');
    }

    function uploadProgress(file, loaded, total) {
        var uploader = this.customSettings.uploader;
        uploader.fire(
            'upload-progress',
            {
                uploaded: loaded,
                total: total
            }
        );
    }

    function uploadSuccess(file, response) {
        var uploader = this.customSettings.uploader;
        uploader.fire(
            'upload-success',
            {
                response: response
            }
        );
    }

    function uploadFail(file, errorCode, errorMsg) {
        if (errorCode !== SWFUpload.UPLOAD_ERROR.FILE_CANCELLED
            && errorCode !== SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED
        ) {
            var uploader = this.customSettings.uploader;
            uploader.fire('upload-fail');
        }
    }

    function beforeDispose() {
        this.swfUpload.destroy();
    }

    /**
     * 获得对外格式一致的文件对象
     *
     * @return {Object}
     */
    function getFileInfo(file) {
        if (file) {
            return {
                name: file.name,
                type: file.type.substr(1),
                size: file.size
            };
        }
    }

    lib.inherits(FlashUploader, SuperClass);


    return FlashUploader;

});

