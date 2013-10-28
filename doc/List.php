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
            var propertyData = [{ name: getProperty('data', 'Array', '列表的数据') },{ name: getProperty('multiple', 'boolean', '是否可以多选') },{ name: getProperty('selectedIndex', 'number', '选定项的索引') },{ name: getProperty('selectedIndexs', 'Array', '选定项的索引数组') },{ name: getProperty('selectedItem', 'Object', '选定项') },{ name: getProperty('selectedItems', 'Array', '选定项的数组') }],
            methodData = [{ name: getMethod('deselectItem', [{ name: 'index', type: 'number', desc: '索引' }], 'boolean', '取消选择') },{ name: getMethod('formatConfig', [], 'void', '') },{ name: getMethod('getTpl', [], 'void', '') },{ name: getMethod('items', [{ name: 'data', type: 'Array', desc: '' }], 'Array', '获取或设置全部列表项') },{ name: getMethod('reset', [], 'void', '') },{ name: getMethod('selectItem', [{ name: 'index', type: 'number', desc: '索引' }], 'boolean', '选中某项') }],
            eventData = [{ name: getEvent('onselect', [{ name: 'item', type: 'Object', desc: '选中项数据' },{ name: 'elem', type: 'HTMLElement', desc: '选中项元素' }], '选中某项时触发') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>List</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            单列列表<br/>&nbsp;&nbsp;<br/>&nbsp;&nbsp;配置项如下：<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;data:&nbsp;[{&nbsp;id:&nbsp;&#39;1&#39;,&nbsp;text:&nbsp;&#39;2&#39;&nbsp;}],&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数据<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;itemTpl:&nbsp;&#39;&lt;li&nbsp;id=&quot;{id}&quot;&gt;{text}&lt;/li&gt;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;每一行的模版（占位符要与属性对应上）<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;multiple:&nbsp;false,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否可多选，默认单选<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;header:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;列表头部的HTML<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;footer:&nbsp;&#39;&#39;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;列表尾部的HTML<br/>&nbsp;&nbsp;}
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
