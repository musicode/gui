require(
    [
        'gui/List'
    ],
    function (List) {

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

        list.onselect = function (e) {
            console.log(e);
        };
    }
);