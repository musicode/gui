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
            var propertyData = [{ name: getProperty('index', 'number', '当前&nbsp;tab&nbsp;在&nbsp;TabGroup&nbsp;中的索引') },{ name: getProperty('panel', 'Panel', '当前&nbsp;tab&nbsp;对应的显示面板') }],
            methodData = [{ name: getMethod('getTpl', [], 'void', '') }],
            eventData = [{ name: getEvent('onclick', [], '点击选项卡触发') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Tab</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            配置项如下：<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选项卡的显示文本，可以是&nbsp;HTML&nbsp;文本<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;icon:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果需要图标，就设置这个配置项吧<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;placement:&nbsp;&#39;right&#39;,&nbsp;&nbsp;如果同时存在&nbsp;text&nbsp;和&nbsp;icon，placement&nbsp;可用来设置&nbsp;text&nbsp;的位置，默认在右侧<br/>&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id:&nbsp;&#39;&#39;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选项卡对应的值，为了以后可以拖动选项卡，这里先设计这样的属性<br/>&nbsp;&nbsp;}<br/>&nbsp;<br/>&nbsp;&nbsp;如果需要切换选项卡的显示内容，必须设置<br/>&nbsp;&nbsp;tab.panel&nbsp;=&nbsp;new&nbsp;fc.ui.Panel();
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
