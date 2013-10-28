<?php
/*
 * Created on 2012-5-20
 *
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 */
$random = mt_rand(10,100);
if ($random % 2 == 0) {

$data = <<<html
[
    { "text": "分组1", "value": "分组1", "data": [ 
        { "text": "1-1", "value": "1-1" },
        { "text": "1-2", "value": "1-2" },
        { "text": "1-3", "value": "1-3" },
        { "text": "1-4", "value": "1-4" }
    ]},
    { "text": "分组2", "value": "分组2", "data": [
        { "text": "2-1", "value": "2-1" },
        { "text": "2-2", "value": "2-2" }
    ]},
    { "text": "分组3", "value": "分组3", "data": [
        { "text": "3-1", "value": "3-1" }
    ]}
]
html;
 } else {
 	$data = '[]';
 }

$json = "{\"data\":{\"dataList\":$data},\"status\":200}";
 echo $json;
?>
