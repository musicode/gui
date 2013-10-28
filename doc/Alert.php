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
            var propertyData = [],
            methodData = [{ name: getMethod('formatConfig', [], 'void', '') }],
            eventData = [];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Alert</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            弹出框<br/>&nbsp;<br/>&nbsp;&nbsp;配置项如下:<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;标题<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;content:&nbsp;&#39;&#39;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;内容<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认底部只有一个&quot;确定&quot;按钮，点击后关闭<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果对按钮有特殊需要，请自行决定按钮个数和对应的&nbsp;click&nbsp;handler<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;buttons:&nbsp;{&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#39;确定&#39;:&nbsp;function()&nbsp;{&nbsp;},<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#39;取消&#39;:&nbsp;function()&nbsp;{&nbsp;}<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;}<br/>&nbsp;<br/>&nbsp;&nbsp;如果对弹出框的类型有要求，比如显示信息，警告，提示等，<br/>&nbsp;&nbsp;统一采用&nbsp;ui.skin(&#39;type&#39;)&nbsp;的方式，皮肤样式请自行实现
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
