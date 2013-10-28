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
            methodData = [{ name: getMethod('Button', [{ name: 'node', type: 'HTMLElement', desc: '组件的最外层元素' },{ name: 'config', type: 'Object', desc: '配置项' }], 'void', '') },{ name: getMethod('getTpl', [], 'void', '') },{ name: getMethod('icon', [{ name: 'value', type: 'string', desc: '图标&nbsp;className' }], 'string', '获取或设置图标') },{ name: getMethod('width', [], 'void', '') }],
            eventData = [{ name: getEvent('onclick', [], '点击按钮触发') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Button</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            按钮<br/>&nbsp;<br/>&nbsp;&nbsp;配置项如下：<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;icon:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;按钮左侧图标,&nbsp;如果按钮没有文字，将只显示该图标<br/>&nbsp;&nbsp;&nbsp;&nbsp;text:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;按钮文字，如果没设置，直接取源元素的&nbsp;innerHTML<br/>&nbsp;&nbsp;&nbsp;&nbsp;iconOnly:&nbsp;false,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否只有图标，而没有文字，默认为&nbsp;false<br/>&nbsp;&nbsp;&nbsp;&nbsp;disable:&nbsp;false,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否置灰，默认为&nbsp;false<br/>&nbsp;&nbsp;&nbsp;&nbsp;placement:&nbsp;&#39;right&#39;&nbsp;&nbsp;&nbsp;文字的位置，如果按钮有图标才会用到这项配置。默认为&nbsp;&#39;right&#39;<br/>&nbsp;&nbsp;}
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
