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
            var propertyData = [{ name: getProperty('lineNumber', 'HTMLElement', '行号') },{ name: getProperty('textarea', 'Input', '输入框') }],
            methodData = [{ name: getMethod('append', [{ name: 'text', type: 'Array|string', desc: '' }], 'void', '在尾部追加文本') },{ name: getMethod('dispose', [], 'void', '') },{ name: getMethod('getTpl', [], 'void', 'override') },{ name: getMethod('text', [{ name: 'text', type: 'Array|string', desc: '' }], 'Array', '获取或设置文本') },{ name: getMethod('value', [{ name: 'value', type: 'string', desc: '' }], 'string', '获取或设置&nbsp;value') }],
            eventData = [{ name: getEvent('onchange', [], '文本变化时触发') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>TextLine</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            封装textarea，带有行号<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;placeholder:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认提示文本<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wordWrap:&nbsp;false&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否开启自动换行,&nbsp;默认为&nbsp;false<br/>&nbsp;&nbsp;}<br/>&nbsp;<br/>&nbsp;&nbsp;使用此组件，必须用&nbsp;css&nbsp;设定宽高度
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
