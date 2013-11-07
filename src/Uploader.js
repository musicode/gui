/**
 * @class Uploader
 * @author zhujl
 */
define(function (require) {

    var SuperClass = require('./interface/Control');
    var Button = require('./Button');

    var supportFormData = typeof FormData !== 'undefined';
    var UploaderClass = supportFormData
                      ? require('./helper/AjaxUploader')
                      : require('./helper/FlashUploader');

    var lib = require('./helper/lib');
    var gui = require('./main');

    /**
     * 上传控件
     *
     * @constructor
     * @param {Object} options
     * @param {string} options.action 上传地址 必须是绝对路径
     * @param {Object} options.data 上传参数
     *
     * @param {Array} options.accept 可选的文件类型，如 image/gif
     *                               具体可见 http://www.iana.org/assignments/media-types
     * @param {string} options.acceptErrorMessage
     * @param {number} options.maxSize 文件大小上限
     * @param {string} options.maxSizeErrroMessage
     *
     * @param {string} options.selectButtonText
     * @param {string} options.uploadButtonText
     * @param {string} options.stopButtonText
     *
     * @param {string} options.emptyText
     * @param {string} options.changeText
     * @param {string} options.startText
     * @param {string} options.progressText
     * @param {string} options.successText
     * @param {string} options.errorText
     */
    function Uploader(options) {
        SuperClass.apply(this, arguments);
    }

    Uploader.prototype = {

        /**
         * 控件类型
         *
         * @type {string}
         */
        type: 'Uploader',

        /**
         * 初始化控件参数
         *
         * @protected
         * @override
         * @param {Object} options
         */
        initOptions: function (options) {
            lib.supply(options, Uploader.defaultOptions);
            SuperClass.prototype.initOptions.call(this, options);
        },

        /**
         * 初始化控件 DOM 结构
         *
         * @protected
         * @override
         */
        initStructure: function () {

            var main = this.main;
            main.html(template);

            var action = main.find('.' + Uploader.CLASS_ACTION);

            // 创建两个按钮
            var uploadButton = new Button({
                label: this.uploadButtonText,
                disabled: true
            });
            uploadButton.appendTo(action);

            var selectButton = new Button({
                label: this.selectButtonText
            });
            selectButton.appendTo(action);

            uploadButton.render();
            selectButton.render();

            this.uploadButton = uploadButton;
            this.selectButton = selectButton;
            this.helper = createHelper(this);

            uploadButton.on('click', clickUploadButton, this);
            this.one('beforedispose', beforeDispose);

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
         * 获得选中的文件
         *
         * @return {Object}
         */
        getFile: function () {
            var file = this.helper.getFile();
            if (file) {
                file.type = file.type.toLowerCase();
            }
            return file;
        },

        /**
         * 上传文件
         */
        startUpload: function () {
            this.helper.startUpload();

            var selectButton = this.selectButton;
            var uploadButton = this.uploadButton;

            disableSelectButton(selectButton);
            uploadButton.setLabel(this.stopButtonText);
        },

        /**
         * 停止上传
         */
        stopUpload: function () {
            this.helper.stopUpload();

            var selectButton = this.selectButton;
            var uploadButton = this.uploadButton;

            enableSelectButton(selectButton);
            uploadButton.setLabel(this.uploadButtonText);
            uploadButton.disable();

            setProgress(this, 0);
            setStatusText(this, this.emptyText);
        }

    };

    var MB = 1024 * 1024;

    Uploader.defaultOptions = {
        //maxSize: 5 * MB,   // 5 M
        changeText: '已选择[ ${filename} ]',
        startText: '正在上传 [ ${filename} ]',
        progressText: '正在上传 ${loaded} M / ${total} M',
        successText: '上传成功',
        errorText: '上传失败',
        acceptErrorMessage: '文件格式不符合要求',
        maxSizeErrorMessage: '${filename} 文件大小超过最大限制',
        selectButtonText: '选择',
        uploadButtonText: '上传',
        stopButtonText: '停止'
    };

    Uploader.painter = {

        emptyText: function (uploader, emptyText) {
            setStatusText(uploader, emptyText);
        },

        width: function (uploader, width) {
            var main = uploader.main;
            main.css('width', width);
        }

    };

    function createHelper(uploader) {

        var helper = new UploaderClass({
            action: uploader.action,
            data: uploader.data,
            accept: uploader.accept
        });
        helper.appendTo(uploader.selectButton.main);
        helper.render();

        helper.on('upload-change', changeFile, uploader);
        helper.on('upload-start', uploadStart, uploader);
        helper.on('upload-complete', uploadComplete, uploader);
        helper.on('upload-progress', uploadProgress, uploader);
        helper.on('upload-success', uploadSuccess, uploader);
        helper.on('upload-fail', uploadFail, uploader);

        return helper;
    }

    function clickUploadButton(e) {
        if (this.uploadButton.getLabel() === this.stopButtonText) {
            this.stopUpload();
        }
        else {
            this.startUpload();
        }
    }

    function setStatusText(uploader, text, statusClass) {
        var infoElement = $('.' + Uploader.CLASS_INFO, uploader.main);
        var textElement = $('.' + Uploader.CLASS_TEXT, infoElement);

        var classList = [ Uploader.CLASS_INFO ];
        if (statusClass) {
            classList.push(statusClass);
        }

        textElement.html(text);
        textElement.prop('title', text);
        infoElement.prop('className', classList.join(' '));
    }

    function setProgress(uploader, percent) {
        var progress = $('.' + Uploader.CLASS_PROGRESS, uploader.main);
        progress.width(percent + '%');
    }

    /**
     * 验证文件是否合法
     *
     * @param {Uploader} uploader
     * @return {boolean}
     */
    function validate(uploader) {

        var file = uploader.getFile();
        if (!file) {
            return false;
        }

        var errorMessage;

        // 判断文件格式
        if (file == null
            || (uploader.accept
                && uploader.accept.indexOf(file.type) === -1)
        ) {
            errorMessage = uploader.acceptErrorMessage;
        }

        else if (uploader.maxSize
            && file.size > uploader.maxSize
        ) {

            errorMessage = lib.template(
                        uploader.maxSizeErrorMessage,
                        { filename: file.name }
                    );
        }

        if (errorMessage) {
            setStatusText(uploader, errorMessage, Uploader.CLASS_ERROR);
            return false;
        }
        return true;
    }

    function changeFile(e) {
        var uploadButton = this.uploadButton;

        if (validate(this)) {

            var file = this.getFile();
            var text = lib.template(
                            this.changeText,
                            { filename: file.name }
                        );

            setStatusText(this, text);
            uploadButton.enable();
        }
        else {
            uploadButton.disable();
        }
    }

    function uploadStart(e) {

        var file = this.helper.getFile();

        var text = lib.template(
                        this.startText,
                        { filename: file.name }
                    );

        setStatusText(this, text);
    }

    function uploadComplete(e) {
        var selectButton = this.selectButton;
        var uploadButton = this.uploadButton;

        enableSelectButton(selectButton);
        uploadButton.setLabel(this.uploadButtonText);
        uploadButton.disable();

        setProgress(this, 0);
    }

    function uploadProgress(e) {

        var file = this.helper.getFile();
        var uploaded = Number(e.uploaded / MB);
        var total = Number(e.total / MB);
        var percent = (uploaded / total) * 100;

        var text = lib.template(
                        this.progressText,
                        {
                            filename: file.name,
                            loaded: uploaded.toFixed(2),
                            total: total.toFixed(2)
                        }
                    );

        setProgress(this, percent);
        setStatusText(this, text, Uploader.CLASS_UPLOADING);
    }

    function uploadSuccess(e) {

        var file = this.getFile();
        var response = e.response;

        if (response) {
            try {
                response = $.parseJSON(response);
            }
            catch (e) { }
        }

        var text = lib.template(
                        this.successText,
                        { filename: file.name }
                    );

        setStatusText(this, text, Uploader.CLASS_SUCCESS);

        this.fire(
            'success',
            {
                response: response
            }
        );
    }

    function uploadFail(e) {
        var file = this.getFile();

        var text = lib.template(
                        this.errorText,
                        { filename: file.name }
                    );

        setStatusText(this, text, Uploader.CLASS_ERROR);

        this.fire('error');
    }

    function beforeDispose() {
        this.helper.dispose();
        this.selectButton.dispose();
        this.uploadButton.dispose();
    }

    function enableSelectButton(button) {
        button.enable();
        var children = button.main.children();
        children.css({
            left: 0,
            top: 0
        });
    }

    function disableSelectButton(button) {
        button.disable();
        var children = button.main.children();
        // 这里不能隐藏
        // 不然 flash 会挂掉
        children.css({
            left: 100,
            top: 100
        });
    }

    var classPrefix = gui.config.uiClassPrefix + '-uploader-';

    /**
     * 上传控件信息的 class
     *
     * @type {string}
     */
    Uploader.CLASS_INFO = classPrefix + 'info';

    /**
     * 上传控件的进度条 class
     *
     * @type {string}
     */
    Uploader.CLASS_PROGRESS = classPrefix + 'progress';

    /**
     * 上传控件的提示信息 class
     *
     * @type {string}
     */
    Uploader.CLASS_TEXT = classPrefix + 'text';

    /**
     * 操作区 class
     *
     * @type {string}
     */
    Uploader.CLASS_ACTION = classPrefix + 'action';

    Uploader.CLASS_UPLOADING = classPrefix + 'status-uploading';
    Uploader.CLASS_SUCCESS = classPrefix + 'status-success';
    Uploader.CLASS_ERROR = classPrefix + 'status-error';


    var template = '<div class="' + Uploader.CLASS_ACTION + '"></div>'
                 + '<div class="' + Uploader.CLASS_INFO + '">'
                 +     '<span class="' + Uploader.CLASS_PROGRESS + '"></span>'
                 +     '<span class="' + Uploader.CLASS_TEXT + '"></span>'
                 + '</div>';

    lib.inherits(Uploader, SuperClass);


    return Uploader;

});

