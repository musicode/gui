<?php
/*
 * Created on 2012-5-20
 *
 * To change the template for this generated file go to
 * Window - Preferences - PHPeclipse - PHP - Code Templates
 */

function getRealPOST() {
    $pairs = explode("&", file_get_contents("php://input"));

    var_dump($pairs);
    $vars = array();
    foreach ($pairs as $pair) {
        $nv = explode("=", $pair);
        $name = urldecode($nv[0]);
        $value = urldecode($nv[1]);
        $vars[$name] = $value;
    }
    return $vars;
}

$uploaddir = './upload/';                  // 设置存储路径

$b = array();
parse_str(file_get_contents("php://input"), $b);

var_dump($_REQUEST);
var_dump($b);
var_dump($_FILES);

return;
$filename = $_FILES['Filedata']['name'];   // 获得选择的文件
$uploadfile = $uploaddir.$filename;      // 存储文件路径
$uploadfile = iconv('utf-8', 'gb2312', $uploadfile);  // 设置文件格式
move_uploaded_file($_FILES['Filedata']['tmp_name'], $uploadfile); // 开始上传

?>
