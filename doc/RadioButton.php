<!doctype html>
<html>
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="../asset/css/reset.css">
        <link rel="stylesheet/less" href="../asset/css/index.less">

        <link rel="stylesheet/less" href="../source/css/skin/simple.less">


        <script src="../asset/js/jquery.js"></script>
        <script src="../ui.js"></script>
        <script src="../asset/js/less.js"></script>
        <script src="../asset/js/detail.js"></script>
        
        <script>
            // 配置表格数据
            var propertyData = [{ name: getProperty('group', 'RadioButtonGroup', '所属的RadioButtonGroup') },{ name: getProperty('value', 'string|number', 'radioButton&nbsp;的值') }],
            methodData = [],
            eventData = [];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>RadioButton</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            配置项如下:<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;描述文本<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;value:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;值<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;selected:&nbsp;true&nbsp;&nbsp;默认是否选中，默认值是&nbsp;false<br/>&nbsp;&nbsp;}
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
