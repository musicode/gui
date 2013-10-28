require(
    [
        'gui/Button'
    ],
    function (Button) {
return;
        var button = new Button({
            main: $('#ui-button')
        });

        button.render();
    }
);