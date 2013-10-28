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
            var propertyData = [{ name: getProperty('button', 'Button', '触发下拉行为的按钮') },{ name: getProperty('list', 'List', '下拉列表') }],
            methodData = [{ name: getMethod('disable', [], 'void', '') },{ name: getMethod('dispose', [], 'void', '') },{ name: getMethod('formatConfig', [], 'void', '') },{ name: getMethod('getTpl', [], 'void', '') },{ name: getMethod('options', [{ name: 'data', type: 'Array', desc: '' }], 'Array', '获取或设置选项') },{ name: getMethod('reset', [], 'void', '') },{ name: getMethod('text', [], 'void', '') },{ name: getMethod('toggle', [], 'void', '显示/隐藏下拉列表') },{ name: getMethod('value', [{ name: 'value', type: 'string', desc: '选中项的值' }], 'string', '获取或设置选中项') },{ name: getMethod('width', [], 'void', '') }],
            eventData = [{ name: getEvent('onselect', [{ name: 'value', type: 'string', desc: '选中的值' },{ name: 'clickButton', type: 'boolean', desc: '如果是&nbsp;button&nbsp;皮肤，需要通过此参数判断是否是点击按钮触发的' }], '选中项发生变化时的处理函数') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>ComboBox</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            下拉菜单<br/>&nbsp;<br/>&nbsp;&nbsp;配置项如下：<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;width:&nbsp;100,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;组件宽度，默认是100&nbsp;px<br/>&nbsp;&nbsp;&nbsp;&nbsp;text:&nbsp;&#39;请选择&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提示文本，默认是“请选择”<br/>&nbsp;&nbsp;&nbsp;&nbsp;disable:&nbsp;false,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否默认是置灰的，默认为&nbsp;false<br/>&nbsp;&nbsp;&nbsp;&nbsp;data:&nbsp;[]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下拉选项数据<br/>&nbsp;&nbsp;}<br/>&nbsp;<br/>&nbsp;&nbsp;其中，data&nbsp;的格式如下：<br/>&nbsp;&nbsp;[<br/>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;text:&nbsp;字面,&nbsp;value:&nbsp;值,&nbsp;selected:&nbsp;true&nbsp;},<br/>&nbsp;&nbsp;&nbsp;&nbsp;...<br/>&nbsp;&nbsp;]
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
