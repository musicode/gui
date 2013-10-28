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
            methodData = [{ name: getMethod('blur', [], 'void', '输入框聚焦') },{ name: getMethod('deleteText', [], 'void', '删除&nbsp;Range&nbsp;内的文本') },{ name: getMethod('focus', [], 'void', '输入框失焦') },{ name: getMethod('isFocus', [], 'Boolean', '输入框是否是聚焦状态') },{ name: getMethod('placeholder', [{ name: 'value', type: 'string', desc: '' }], 'string', '获取或设置&nbsp;placeholder') },{ name: getMethod('range', [{ name: 'range', type: 'Object', desc: '' }], 'Object', '获取或设置组件的&nbsp;Range&nbsp;对象<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Range&nbsp;对象结构如下：<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;start:&nbsp;选区开始位置<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;end:&nbsp;选区结束位置<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text:&nbsp;选区内的文本<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果是&nbsp;setter，表示把&nbsp;start&nbsp;和&nbsp;end&nbsp;之间的文本改变为&nbsp;text') },{ name: getMethod('replaceText', [], 'void', '替换&nbsp;Range&nbsp;内的文本') },{ name: getMethod('value', [{ name: 'value', type: 'string', desc: '' }], 'string', '获取或设置输入框的文本') }],
            eventData = [{ name: getEvent('onblur', [{ name: 'value', type: 'string', desc: '输入框文本' }], '失焦时触发') },{ name: getEvent('onchange', [{ name: 'value', type: 'string', desc: '输入框文本' }], '内容发生改变时触发') },{ name: getEvent('onfocus', [{ name: 'value', type: 'string', desc: '输入框文本' }], '聚焦时触发') },{ name: getEvent('onsubmit', [{ name: 'value', type: 'string', desc: '输入框文本' }], '按下回车时触发') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Input</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            增强两种元素：&lt;input&nbsp;type=&quot;text&quot;&nbsp;/&gt;&nbsp;和&nbsp;&lt;textarea&gt;&lt;/textarea&gt;<br/>&nbsp;<br/>&nbsp;&nbsp;如果需要开启&nbsp;placeholder&nbsp;功能，只需在&nbsp;html&nbsp;里加上&nbsp;_placeholder&nbsp;属性即可<br/>&nbsp;&nbsp;<br/>&nbsp;&nbsp;=============================&nbsp;2012/9/17&nbsp;更新&nbsp;===========================================<br/>&nbsp;&nbsp;最新的Firefox，placeholder&nbsp;表现行为和Chrome一致，但它没有提供&nbsp;focus&nbsp;时修改&nbsp;placeholder&nbsp;为透明色的<br/>&nbsp;&nbsp;CSS&nbsp;属性；再考虑到IE10&nbsp;完全不支持修改颜色，所以去掉原生&nbsp;placeholder&nbsp;功能，所有浏览器都转用模<br/>&nbsp;&nbsp;拟实现。
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
