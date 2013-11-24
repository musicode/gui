require(
    [
        'gui/Table',
        'gui/lib/lib'
    ],
    function (Table, lib) {

        var datasource = [ ];
        for (var i = 0, len = 20; i < len; i++) {
            datasource.push({ title: '标题' + i, index: i, id: lib.random() });
        }

        var table = new Table({
            main: $('#ui-table'),
            fields: [
                {
                    title: '标题',
                    field: 'title',
                    tip: 'xxx',
                    width: 100,
                    sortable: false,
                    resizable: true,
                    content: function (item) {
                        return item.title;
                    }
                },
                {
                    title: '索引',
                    field: 'index',
                    sortable: true,
                    resizable: true,
                    align: 'right',
                    content: function (item) {
                        return item.index;
                    }
                },
                {
                    title: 'ID',
                    field: 'id',
                    sortable: false,
                    resizable: true,
                    align: 'right',
                    content: function (item) {
                        return item.id;
                    }
                }
            ],
            datasource: datasource,
            selectMode: 'box',
            multiple: true,
            maxBodyHeight: 300
        });

        var start = new Date();
        table.on('render-complete', function () {
            var end = new Date();
            console.log('耗时: ' + (end - start));
        });
        table.on('select', function (e) {
            console.log(e);
        });

        table.render();

    }
);