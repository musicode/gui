require(
    [
        'gui/ToolTip'
    ],
    function (ToolTip) {

        var tip = new ToolTip({
            main: $('#ui-tip'),
            content: '内容',
            showBy: 'over',
            width: 100,
            position: 'rb'
        });

        tip.render();
    }
);