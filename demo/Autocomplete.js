require(
    [
        'gui/Autocomplete'
    ],
    function (Autocomplete) {

        var datasource = [
            { text: 'text1', value: 1 },
            { text: 'text2', value: 2 },
            { text: 'text3', value: 3 },
            { text: 'text4', value: 4 }
        ];

        var autocomplete = new Autocomplete({
            main: $('#ui-autocomplete'),
            width: 200,
            placeholder: '试试输入 text',
            local: function (callback) {
                callback(datasource)
            }
        });

        autocomplete.render();
    }
);