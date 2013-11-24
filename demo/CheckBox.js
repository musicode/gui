require(
    [
        'gui/CheckBox'
    ],
    function (CheckBox) {

        var checkBox = new CheckBox({
            main: $('#ui-checkbox'),
            label: 'baidu'
        });

        checkBox.render();

    }
);