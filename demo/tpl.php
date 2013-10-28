<!DOCTYPE html>
<html>

    <head>
        <meta charset="utf-8">
    
        <title><?php echo $obj['ui'] ?> 示例</title>
        <link rel="stylesheet" href="asset/css/reset.css">
        <link rel="stylesheet" href="asset/css/shCore.css">
        <link rel="stylesheet" href="asset/css/shCoreZhujl.css">

        <link rel="stylesheet/less" href="../src/css/skin/simple.less">
        <link rel="stylesheet/less" href="asset/css/demo.less">
        <script src="asset/js/less.js"></script>

        <script src="asset/js/jquery.js"></script>
        <script src="asset/js/shCore.js"></script>
        <script src="asset/js/shBrushXml.js"></script>
        <script src="asset/js/shBrushJScript.js"></script>
        <script src="../ui.js"></script>
        

        <style>
            <?php

if (!empty($obj['css'])) {
    echo $obj['css'];
}
            ?>
        </style>

        <script>
            var <?php echo $obj['ui'] ?> = fc.ui['<?php echo $obj['ui'] ?>'],
                $ = $$;
        </script>
    </head>

    <body>

        <header>
            <h1><?php echo $obj['ui'] ?></h1>
            <ul class="nav">
<?php 
foreach($obj['demos'] as $demo) {
    echo '<li><a href="#'.$demo->title.'">'.$demo->title.'</a></li>';
}
?>              
            </ul>
        </header>
            

<?php 
foreach($obj['demos'] as $demo) {
    echo $demo->toHTML();
}
	
?>

        <script>
            SyntaxHighlighter.all();
            window.onload = function() {
                setTimeout(function() {
<?php
foreach($obj['demos'] as $demo) {
    echo $demo->jsCode;
}
?>
                }, 10);
            };
        </script>
    </body>

</html>

