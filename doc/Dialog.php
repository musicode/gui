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
            methodData = [{ name: getMethod('close', [], 'void', '关闭对话框') },{ name: getMethod('dispose', [], 'void', '') },{ name: getMethod('formatConfig', [], 'void', '') },{ name: getMethod('getTpl', [], 'void', 'override') },{ name: getMethod('height', [], 'void', '') },{ name: getMethod('onresize', [], 'void', '如果子类不需要居中，继承时设置为&nbsp;null') }],
            eventData = [{ name: getEvent('onclose', [], '点击关闭按钮或手动调用&nbsp;close()&nbsp;触发') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Dialog</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            对话框<br/>&nbsp;<br/>&nbsp;&nbsp;配置项如下：<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;标题<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;content:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;内容，需指定模版<br/>&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;width:&nbsp;100,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;宽度<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;height:&nbsp;100,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;高度<br/>&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;modal:&nbsp;true,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否模态，默认为&nbsp;true<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;center:&nbsp;true&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否居中对齐，默认居中<br/>&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过&nbsp;buttons&nbsp;项进行按钮个数和&nbsp;click&nbsp;handler&nbsp;配置<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果不想显示按钮，无视此项配置<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;buttons:&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#39;确定&#39;:&nbsp;function()&nbsp;{&nbsp;},<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#39;取消&#39;:&nbsp;function()&nbsp;{&nbsp;}<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},<br/>&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;draggable:&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;拖拽配置，默认拖拽&nbsp;header<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;如果不需要拖拽，设置为&nbsp;false&nbsp;即可<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;}<br/>&nbsp;<br/>&nbsp;&nbsp;注意，如果要继承&nbsp;Dialog&nbsp;且不打算覆盖&nbsp;getTpl()，子类模版必须包括：<br/>&nbsp;&nbsp;XXX.TPL_UI<br/>&nbsp;&nbsp;XXX.TPL_FOOTER
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
