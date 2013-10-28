require(
    [
        'gui/Tip'
    ],
    function (Tip) {

        var tip = new Tip({
            main: $('#ui-tip'),
            content: '内容',
            showBy: 'over',
            width: 100,
            position: 'rb'
        });

        tip.render();
    }
);