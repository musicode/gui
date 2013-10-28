require(
    [
        'gui/Dialog',
        'gui/Button'
    ],
    function (Dialog, Button) {

        var dialog;
        var btn = new Button({
            main: $('#ui-dialog')
        });

        btn.render();

        btn.on('click', function () {

            if (!dialog) {
                dialog = new Dialog({
                    title: '标题',
                    content: '内容',
                    top: '10%',
                    left: 10,
                    width: 300,
                    buttons: {
                        '确定': function () {
                            dialog.hide();
                        },
                        '取消': function () {
                            dialog.hide();
                        }
                    }
                });
            }

            dialog.show();
        });
    }
);