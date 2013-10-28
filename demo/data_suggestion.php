<?php
/*
 * Created on 2012-5-20
 *
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 */
$random = mt_rand(10,100);
if ($random % 2 == 0) {
     $data = '["第一条提示","第二条提示","第三条提示","第四条提示","第五条提示"]';
 } else {
 	$data = '[]';
 }

$json = "{\"data\":{\"dataList\":$data},\"status\":200}";
 echo $json;
?>
