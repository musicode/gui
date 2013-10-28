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
            methodData = [{ name: getMethod('dispose', [], 'void', '销毁') },{ name: getMethod('hide', [{ name: 'ui', type: 'Base', desc: '组件' }], 'boolean', '隐藏') },{ name: getMethod('show', [{ name: 'ui', type: 'Base', desc: '组件' }], 'boolean', '显示') }],
            eventData = [];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Blur</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            ======================================<br/>&nbsp;&nbsp;支持浮层点击外部区域隐藏消失
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
