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
            <h1>Draggable</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            =======================================<br/>&nbsp;&nbsp;实现元素的可拖拽<br/>&nbsp;&nbsp;配置项如下：<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;axis:&nbsp;&#39;x|y&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;是否限制在&nbsp;x&nbsp;或&nbsp;y&nbsp;轴上移动<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;containment:&nbsp;&#39;selector&#39;,&nbsp;&nbsp;//&nbsp;设置一个容器，限制移动范围<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;handle:&nbsp;&#39;selector&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;移动柄<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cancel:&nbsp;&#39;selector&#39;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;不响应移动区域<br/>&nbsp;&nbsp;}
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
