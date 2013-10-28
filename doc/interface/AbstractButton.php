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
            var propertyData = [{ name: getProperty('enabled', 'boolean', '是否可用') },{ name: getProperty('selected', 'boolean', '是否选中<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否&nbsp;toggleable&nbsp;为&nbsp;true&nbsp;时启用此属性') },{ name: getProperty('toggleable', 'boolean', '是否可以切换状态') }],
            methodData = [{ name: getMethod('disable', [{ name: 'b', type: 'boolean', desc: '是否置灰' }], 'void', '是否置灰按钮<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;置灰操作将导致按钮不具交互性') },{ name: getMethod('formatConfig', [], 'void', '') },{ name: getMethod('select', [{ name: 'b', type: 'boolean', desc: '是否选中' }], 'void', '是否选中按钮，只有&nbsp;toggleable&nbsp;为&nbsp;true&nbsp;时此方法才可用') },{ name: getMethod('text', [{ name: 'value', type: 'string', desc: '按钮文本' }], 'string', '获取或设置按钮文本') }],
            eventData = [];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>AbstractButton</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            按钮抽象类<br/>&nbsp;<br/>&nbsp;&nbsp;主要功能如下：<br/>&nbsp;&nbsp;1.&nbsp;设置和获取&nbsp;text<br/>&nbsp;&nbsp;2.&nbsp;text&nbsp;的位置，即&nbsp;left&nbsp;或&nbsp;right，默认是&nbsp;right<br/>&nbsp;&nbsp;3.&nbsp;是否&nbsp;disable<br/>&nbsp;&nbsp;4.&nbsp;是否&nbsp;selected,&nbsp;只有开启&nbsp;toggleable&nbsp;为&nbsp;true&nbsp;才会生效<br/>&nbsp;<br/>&nbsp;&nbsp;配置项如下：<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;placement:&nbsp;&#39;right&#39;,&nbsp;&nbsp;&nbsp;&nbsp;text&nbsp;的位置，默认为&nbsp;&#39;right&#39;，也可以设为&#39;left&#39;<br/>&nbsp;&nbsp;&nbsp;&nbsp;toggleable:&nbsp;false,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否可以切换状态，默认为&nbsp;false<br/>&nbsp;&nbsp;&nbsp;&nbsp;selected:&nbsp;false,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果&nbsp;toggleable&nbsp;为&nbsp;true，则可以用&nbsp;selected&nbsp;设置默认是否已选中，默认为&nbsp;false<br/>&nbsp;&nbsp;&nbsp;&nbsp;disable:&nbsp;false&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否置灰，默认为&nbsp;false<br/>&nbsp;&nbsp;}<br/>&nbsp;&nbsp;<br/>&nbsp;&nbsp;目前已实现的子类有：<br/>&nbsp;&nbsp;Button<br/>&nbsp;<br/>&nbsp;&nbsp;主要注意的是：<br/>&nbsp;&nbsp;组件模版（&nbsp;即子类实现的getTpl()&nbsp;），唯一的硬性要求是<br/>&nbsp;&nbsp;&nbsp;&nbsp;如果有&nbsp;text，对应的元素&nbsp;class&nbsp;必须包含&nbsp;AbstractButton.CSS_TEXT<br/>&nbsp;&nbsp;&nbsp;&nbsp;如果有&nbsp;icon，对应的元素&nbsp;class&nbsp;必须包含&nbsp;AbstractButton.CSS_ICON
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
