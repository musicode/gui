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
            var propertyData = [{ name: getProperty('columns', 'Array', '表格列') },{ name: getProperty('tbody', 'Tbody', '表身') },{ name: getProperty('thead', 'Thead', '表头') }],
            methodData = [{ name: getMethod('deleteRow', [{ name: 'index', type: 'number', desc: '行号，从&nbsp;0&nbsp;开始计数' }], 'void', '删除第&nbsp;index&nbsp;行') },{ name: getMethod('dispose', [], 'void', '') },{ name: getMethod('getGroup', [{ name: 'index', type: 'number|HTMLElement', desc: '' }], 'void', '') },{ name: getMethod('getRow', [{ name: 'index', type: 'number', desc: '可以是行索引(表格无分组)，也可以是表格行元素(表格有分组)' }], 'Object', '获得&nbsp;Row&nbsp;对象<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;返回对象结构为<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;index:&nbsp;索引<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;node:&nbsp;HTMLElement,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;row:&nbsp;row&nbsp;对象<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}') },{ name: getMethod('getSelectedData', [], 'Array', '获得选中的数据') },{ name: getMethod('getTotalRows', [], 'Array', '获得所有&nbsp;Row&nbsp;对象') },{ name: getMethod('height', [], 'void', '') },{ name: getMethod('insertGroups', [{ name: 'index', type: 'number', desc: '插入的位置' },{ name: 'data', type: 'Array', desc: '插入的数据' }], 'void', '在第&nbsp;index&nbsp;组插入分组') },{ name: getMethod('insertRows', [{ name: 'index', type: 'number', desc: '插入的位置' },{ name: 'data', type: 'Array', desc: '插入的数据' }], 'void', '在第&nbsp;index&nbsp;行插入行') },{ name: getMethod('loading', [], 'void', '转成&nbsp;loading&nbsp;状态') },{ name: getMethod('render', [{ name: 'data', type: 'Array', desc: '要渲染的数据' }], 'void', '渲染tbody') },{ name: getMethod('reset', [], 'void', '重置整个表格，如果需要渲染tbody，需再调用&nbsp;render()<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设计这个接口是为了自定义列考虑的') },{ name: getMethod('setRowContent', [{ name: 'index', type: 'number', desc: '行号' },{ name: 'text', type: 'string', desc: '内容' }], 'HTMLElement', '因为&nbsp;IE&nbsp;不支持&nbsp;tr.innerHTML&nbsp;=&nbsp;&#39;&#39;&nbsp;方式覆盖<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;因此设计一个接口，专门处理这类需求') }],
            eventData = [{ name: getEvent('onafterrender', [{ name: 'interrupt', type: 'boolean', desc: '是否是中断。正在渲染表格的时候，用户再次触发了表格的渲染，<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;就需要中断上次的渲染行为' }], '表格渲染完成的事件处理函数') },{ name: getEvent('onrowenter', [{ name: 'tr', type: 'HTMLElement', desc: '表格的&nbsp;tr&nbsp;元素' }], '鼠标移进表格行的事件处理函数') },{ name: getEvent('onrowleave', [{ name: 'tr', type: 'HTMLElement', desc: '表格的&nbsp;tr&nbsp;元素' }], '鼠标移出表格行的事件处理函数') },{ name: getEvent('onselect', [], '如果配置了&nbsp;selectable:&nbsp;true<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用户勾选单行或顶部的&nbsp;checkbox&nbsp;时触发') },{ name: getEvent('onsort', [{ name: 'field', type: 'string', desc: '表示哪一列被排序' },{ name: 'type', type: 'string', desc: '排序类型，asc&nbsp;或&nbsp;desc' }], '点击排序按钮的事件处理函数') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Table</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            [TODO]&nbsp;<br/>&nbsp;&nbsp;1.&nbsp;.table-td&nbsp;设置padding时需要动态取值计算宽度<br/>&nbsp;&nbsp;2.&nbsp;再次调用render()时，状态的重置，比如需要取消header的checkbox的选中状态<br/>&nbsp;<br/>&nbsp;&nbsp;如果单元格不需要边框色，请设置<br/>&nbsp;&nbsp;td&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;border-color:&nbsp;transparent;<br/>&nbsp;&nbsp;}<br/>&nbsp;&nbsp;不要设置为&nbsp;border:&nbsp;none;&nbsp;否则会略微影响表格的对齐效果<br/>&nbsp;<br/>列配置项如下：<br/>{<br/>&nbsp;//&nbsp;第一列是否为&nbsp;checkbox<br/>&nbsp;selectable:&nbsp;true,<br/><br/>&nbsp;//&nbsp;默认的显示提示语（创建时的）<br/>&nbsp;defaultTip:&nbsp;&#39;&#39;,<br/>&nbsp;//&nbsp;加载数据时的提示语<br/>&nbsp;loadingTip:&nbsp;&#39;&#39;,<br/>&nbsp;//&nbsp;数据为空时显示的提示语,&nbsp;显示在表格主体，居中对齐<br/>&nbsp;emptyTip:&nbsp;&#39;&#39;,<br/><br/>&nbsp;//&nbsp;配置分组<br/>&nbsp;group:&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;分组标题字段，默认是&nbsp;title<br/>&nbsp;&nbsp;&nbsp;&nbsp;title:&nbsp;&#39;&#39;,&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;分组数据字段，默认是&nbsp;data<br/>&nbsp;&nbsp;&nbsp;&nbsp;data:&nbsp;&#39;&#39;,<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;是否可折叠,&nbsp;只有为true，下面两个属性才有意义<br/>&nbsp;&nbsp;&nbsp;&nbsp;foldable:&nbsp;true,<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;默认是否为折叠状态<br/>&nbsp;&nbsp;&nbsp;&nbsp;defaultFolded:&nbsp;true,<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;如果&nbsp;defaultFolded&nbsp;为&nbsp;true，则用这个属性设置首次折叠时显示多少条，<br/>&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;之后的折叠统一是显示0条<br/>&nbsp;&nbsp;&nbsp;&nbsp;showSize:&nbsp;5<br/>&nbsp;},<br/><br/>&nbsp;columns:&nbsp;[<br/>&nbsp;&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;该列对应的数据的字段名<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;field:&nbsp;&#39;&#39;,&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;字段类型，可选三种：text&nbsp;number&nbsp;date,&nbsp;默认是text<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type:&nbsp;&#39;date&#39;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;如果&nbsp;type&nbsp;为&nbsp;date，需配置&nbsp;date&nbsp;的格式<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pattern:&nbsp;&#39;yyyy-MM-dd&#39;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;该列是否可拖拽改变列宽<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;dragable:&nbsp;true,&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;是否绑定到第一列的&nbsp;checkbox<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;isBuddy:&nbsp;false,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;表头的标题，可以是&nbsp;string&nbsp;或&nbsp;function<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title:&nbsp;&#39;&#39;,&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;内容，可以是&nbsp;string&nbsp;或&nbsp;function<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;content:&nbsp;function(dataItem)&nbsp;{&nbsp;return&nbsp;dataItem.a;&nbsp;},<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;表格行的class，一般只需要第一列设置此接口即可<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rowClass:&nbsp;function(dataItem)&nbsp;{&nbsp;return&nbsp;&#39;class&#39;;&nbsp;},<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;该列是否可排序<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sortable:&nbsp;true,&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;表头是否需要气泡，需要的话填入&nbsp;bubble&nbsp;的&nbsp;source&nbsp;名称<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bubble:&nbsp;&#39;sourceName&#39;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;配置样式，格式和&nbsp;css&nbsp;完全一致<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;style:&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;width:&nbsp;200<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#39;min-width&#39;:&nbsp;100<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;&nbsp;&nbsp;},<br/>&nbsp;&nbsp;&nbsp;&nbsp;...<br/>&nbsp;]<br/>}
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
