require(
    [
        'gui/Button'
    ],
    function (Button) {

        var button = new Button({
            main: $('#ui-button')
        });

        button.render();
        button.on('click', function (e) {
            p('click');
        });
        button.on('change', function (e) {
            p('change');
        });
    }
);