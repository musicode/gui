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
            var propertyData = [{ name: getProperty('tabs', 'Array', '已加入的Tab') }],
            methodData = [{ name: getMethod('appendTab', [{ name: 'tab', type: 'Tab', desc: '新加入的Tab' }], 'void', '在最后加入一个Tab') },{ name: getMethod('dispose', [], 'void', '') },{ name: getMethod('getTpl', [], 'void', '') },{ name: getMethod('insertTab', [{ name: 'index', type: 'number', desc: '插入的位置' },{ name: 'tab', type: 'Tab', desc: '插入的Tab' }], 'void', '在第&nbsp;index&nbsp;个位置插入一个Tab') },{ name: getMethod('selectTab', [{ name: 'index', type: 'number|Tab', desc: '第几个&nbsp;Tab' }], 'void', '选中第&nbsp;index&nbsp;个&nbsp;Tab，从&nbsp;0&nbsp;开始计数。也可以传入组内已经存在的&nbsp;Tab&nbsp;对象') }],
            eventData = [{ name: getEvent('onselect', [{ name: 'tab', type: 'Tab', desc: '选中的&nbsp;tab' }], '') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>TabGroup</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            选项卡组<br/>&nbsp;<br/>&nbsp;&nbsp;配置项如下：<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;align:&nbsp;&#39;left&#39;,&nbsp;&nbsp;&nbsp;tabs&nbsp;对齐方式，可选值有&nbsp;left,&nbsp;center,&nbsp;right，默认是&nbsp;left<br/>&nbsp;&nbsp;}<br/>&nbsp;<br/>&nbsp;&nbsp;如果要用&nbsp;Tab&nbsp;组件，一般都需要配合&nbsp;TabGroup&nbsp;使用
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
