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
            methodData = [{ name: getMethod('firstPage', [], 'void', '翻到第一页') },{ name: getMethod('getTpl', [], 'void', '') },{ name: getMethod('lastPage', [], 'void', '翻到最后一页') },{ name: getMethod('nextPage', [], 'void', '翻到下一页') },{ name: getMethod('pageTo', [{ name: 'index', type: 'number', desc: '' }], 'void', '翻到第&nbsp;index&nbsp;页') },{ name: getMethod('prevPage', [], 'void', '翻到上一页') },{ name: getMethod('reset', [], 'void', '') }],
            eventData = [{ name: getEvent('onpage', [{ name: 'index', type: 'number', desc: '第几页' },{ name: 'range', type: 'Object', desc: '数据的开始结束范围&nbsp;{&nbsp;start:&nbsp;x,&nbsp;end:&nbsp;x&nbsp;}' }], '') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Page</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            翻页<br/>&nbsp;&nbsp;配置项如下：<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;totalSize:&nbsp;100,&nbsp;&nbsp;数据总量<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pageSize:&nbsp;10,&nbsp;&nbsp;&nbsp;&nbsp;每页显示多少条<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;index:&nbsp;0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前第几页<br/>&nbsp;&nbsp;}
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
