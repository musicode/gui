require(
    [
        'gui/Uploader'
    ],
    function (Uploader) {

        var uploader = new Uploader({
            main: $('#ui-uploader'),
            emptyText: '请上传一个文件',
            selectButtonText: '选择文件',
            width: 500,
            action: '/gui/demo/data_upload.php',
            data: {
                name: 'zhujl',
                age: 20
            }
        });

        uploader.render();
        uploader.onsuccess = function (e) {
            console.log('上传成功');
            console.log(e);
        };
        uploader.onerror = function (e) {
            console.log('上传失败');
            console.log(e);
        };
    }
);