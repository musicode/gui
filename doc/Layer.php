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
            methodData = [{ name: getMethod('dispose', [], 'void', '') },{ name: getMethod('formatConfig', [], 'void', '') },{ name: getMethod('getTpl', [], 'void', '') },{ name: getMethod('hide', [], 'void', '') },{ name: getMethod('show', [], 'void', '') }],
            eventData = [];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Layer</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            Layer&nbsp;的子类，增加如下功能：<br/>&nbsp;&nbsp;1.&nbsp;右上角有个&nbsp;关闭按钮，如果不需要，可配置<br/>&nbsp;&nbsp;2.&nbsp;支持&nbsp;footer&nbsp;buttons，配置方法见下方<br/>&nbsp;&nbsp;3.&nbsp;内容区自定义<br/>&nbsp;<br/>&nbsp;&nbsp;配置项如下：<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;标题<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果设置为字符串（即使是&#39;&#39;），会占据高度；<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果不设置，则不会占据高度;<br/>&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;content:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;内容<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;buttons:&nbsp;{&nbsp;},&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;参考&nbsp;Dialog&nbsp;设置<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;width:&nbsp;400,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;宽度，默认宽度遵循皮肤设置<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;removeClose:&nbsp;true&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否删除右上角的关闭按钮，默认是显示的<br/>&nbsp;&nbsp;}<br/>&nbsp;<br/>&nbsp;&nbsp;对于某些极端的配置，比如：<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;content:&nbsp;&#39;html&#39;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;removeClose:&nbsp;true<br/>&nbsp;&nbsp;}<br/>&nbsp;<br/>&nbsp;&nbsp;这样的结果就是只剩下内容区，因此组件会自动进行调整<br/>&nbsp;&nbsp;去掉所谓的&nbsp;header&nbsp;content&nbsp;footer&nbsp;概念
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
