require(
    [
        'gui/ScrollPanel'
    ],
    function (ScrollPanel) {

        var panel = new ScrollPanel({
            main: $('#ui-scrollpanel'),
            width: 200,
            height: 500
        });
        panel.render();
    }
);