require(
    [
        'gui/Tab'
    ],
    function (Tab) {

        var tab = new Tab({
            main: $('#ui-tab'),
            width: 514,
            datasource: [
                { title: '标题1', content: '内容1' },
                { title: '标题2', content: '内容2' },
                { title: '标题3', content: '内容3' }
            ]
        });

        tab.render();

        tab.onselect = function (e) {
            console.log(e);
        };
    }
);