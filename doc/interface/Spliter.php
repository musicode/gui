<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="../../asset/css/reset.css">
        <link rel="stylesheet/less" href="../../asset/css/index.less">

        <link rel="stylesheet/less" href="../../source/css/skin/simple.less">


        <script src="../../asset/js/jquery.js"></script>
        <script src="../../ui.js"></script>
        <script src="../../asset/js/less.js"></script>
        <script src="../../asset/js/detail.js"></script>
        
        <script>
            // 配置表格数据
            var propertyData = [],
            methodData = [],
            eventData = [];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Spliter</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            分割窗口<br/>&nbsp;&nbsp;<br/>&nbsp;&nbsp;配置项如下:<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dir:&nbsp;0|1,&nbsp;&nbsp;&nbsp;&nbsp;方向，0&nbsp;表示水平，1&nbsp;表示垂直<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;contents<br/>&nbsp;&nbsp;}
            </p>
        </section>
        
        <section>
            <div id="propertys"></div>
            
        </section>

        <section>
            <div id="methods"></div>
        </section>

        <section>
            <div id="events"></div>

        </section>
    </body>
</html>
