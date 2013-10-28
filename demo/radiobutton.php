<?php
include('demo.php');

// 第1个demo
$demo1_html = <<<html
    <div id="radioButton1_0"></div>
    <div id="radioButton1_1"></div>
    <div id="radioButton1_2"></div>
html;

$demo1_js = <<<js
    var group = new fc.ui.RadioButtonGroup('person');
    group.addRadioButton(new RadioButton($('#radioButton1_0')[0], {
        text: '哈哈',
        value: '0'
    }));
    group.addRadioButton(new RadioButton($('#radioButton1_1')[0], {
        text: 'ABC',
        value: '1',
        selected: true
    }));
    group.addRadioButton(new RadioButton($('#radioButton1_2')[0], {
        text: '123',
        value: '2'
    }));
    group.onchange = function() {
        p('当前选中的是:' + this.selectedRadioButton.value);
    }
js;

$demos[0] = new Demo('创建RadioButton', '', $demo1_html, $demo1_js);

$css = <<<css
    .fc-ui-radiobutton {
        margin-right: 10px;
    }
css;

$obj = array(
	'ui' => 'RadioButton',
    'demos' => $demos,
    'css' => $css
);

include('tpl.php');
?>
