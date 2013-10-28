require(
    [
        'gui/ComboBox'
    ],
    function (ComboBox) {

        var datasource = [
            { text: '选项1', value: 1 },
            { text: '选项2', value: 2 },
            { text: '选项3', value: 3 },
            { text: '选项4', value: 4 },
            { text: '选项555555555555555555555555555555', value: 5 },
            { text: '选项6', value: 6 },
            { text: '选项7', value: 7 },
            { text: '选项8', value: 8 },
            { text: '选项9', value: 9 }
        ];

        var combobox = new ComboBox({
            main: $('#ui-combobox')[0],
            emptyText: '请选择',
            datasource: datasource,
            maxHeight: 150,
            overflow: true
        });

        combobox.render();
        combobox.onselect = function (e) {
            console.log(e);
        };
    }
);