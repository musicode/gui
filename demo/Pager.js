require(
    [
        'gui/Pager'
    ],
    function (Pager) {

        var pager = new Pager({
            main: $('#ui-pager'),
            total: 1000,
            page: 10
        });

        pager.render();

        pager.onchange = function (e) {
            console.log(e);
        };
    }
);