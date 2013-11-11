require(
    [
        'gui/TextEditor'
    ],
    function (TextEditor) {

        var textEditor = new TextEditor({
            main: $('#ui-texteditor'),
            placeholder: '请输入...',
            width: 500,
            height: 300,
            wordWrap: false
        });

        textEditor.render();
    }
);