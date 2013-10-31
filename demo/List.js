require(
    [
        'gui/List',
        'gui/helper/Iterator'
    ],
    function (List, Iterator) {

        var datasource = [ ];

        for (var i = 0; i < 10; i++) {
            datasource.push({ text: 'text' + i, value: i });
        }

        var list = new List({
            main: $('#ui-list'),
            datasource: datasource,
            toggle: true
        });
        list.render();

        var iterator = new Iterator({
            loop: true
        });

        iterator.start(0, 0, datasource.length);
        iterator.on('enter', function (e, index) {
            list.selectItemByIndex(index);
        });
        iterator.on('leave', function (e, index) {
            list.deselectItemByIndex(index);
        });

        list.onselect = function (e) {
            console.log(e);
        };
    }
);