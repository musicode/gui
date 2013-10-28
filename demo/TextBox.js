require(
    [
        'gui/TextBox'
    ],
    function (TextBox) {

        var textbox = new TextBox({
            main: $('#ui-textbox'),
            width: 200
        });

        textbox.render();

        textbox.on('focus', function () {
            console.log('focus');
        });

        textbox.on('input', function () {
            console.log('input');
            console.log(textbox.getValue());
        });

        textbox.on('blur', function () {
            console.log('blur');
        });
    }
);