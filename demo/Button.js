require(
    [
        'gui/Button'
    ],
    function (Button) {

        var button = new Button({
            main: $('#ui-button')
        });

        button.render();
    }
);