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
            var propertyData = [{ name: getProperty('icon', 'HTMLElement', '图标元素') },{ name: getProperty('layer', 'Layer', '气泡层') }],
            methodData = [{ name: getMethod('close', [], 'void', '关闭气泡层') },{ name: getMethod('content', [{ name: 'content', type: 'string|Function', desc: '' }], 'string', '获取或设置内容') },{ name: getMethod('formatConfig', [], 'void', '除了配置对象，还需要传入组件元素，主要是给&nbsp;parent&nbsp;配置项使用的') },{ name: getMethod('getTpl', [], 'void', '') },{ name: getMethod('open', [], 'void', '打开气泡层') },{ name: getMethod('title', [{ name: 'text', type: 'string|Function', desc: '' }], 'string', '获取或设置标题') }],
            eventData = [];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Bubble</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            配置项如下：<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;title:&nbsp;[String|Function],&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;标题<br/>&nbsp;&nbsp;&nbsp;&nbsp;content:&nbsp;[String|Function],&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;内容<br/>&nbsp;&nbsp;&nbsp;&nbsp;position:&nbsp;[lt|ct|rt|rm|rb|cb|lb|lm],&nbsp;显示位置，默认会自动算出最优显示位置，如需强制定位，传入某个值<br/>&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;container:&nbsp;&#39;#id&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;气泡相对的容器(用于浮层的自动定位)，默认是body，这个属性可以是选择器（字符串），也可以是DOM元素<br/>&nbsp;&nbsp;&nbsp;&nbsp;icon:&nbsp;&#39;className&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;气泡图标<br/>&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;showBy:&nbsp;[auto|hover|click],&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;触发显示条件，自动显示、鼠标悬浮或点击<br/>&nbsp;&nbsp;&nbsp;&nbsp;hideBy:&nbsp;&#39;out&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;触发隐藏的条件:&nbsp;自动消失、鼠标离开或组件失焦<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注意：所有气泡都会失焦隐藏，所以如果隐藏条件是&nbsp;out&nbsp;&amp;&amp;&nbsp;blur&nbsp;时，只需传out<br/>&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;showTime:&nbsp;1000,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果显示后需要自动隐藏，可以设置此项，单位是毫秒<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;onopen:&nbsp;function()&nbsp;{},&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;显示气泡层的回调函数，因为使用气泡大部分情况下不需要拿到Bubble对象的引用，所以只能写在配置里了<br/>&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;如果IE下出现&nbsp;z-index&nbsp;错乱，传入父级元素（切记是非static&nbsp;定位）进行修正<br/>&nbsp;&nbsp;&nbsp;&nbsp;如果出现闪烁，确定该父元素是否hasLayout<br/>&nbsp;&nbsp;&nbsp;&nbsp;parent:&nbsp;&#39;selector&#39;,<br/>&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;下面是新功能提示部分的配置<br/>&nbsp;&nbsp;&nbsp;&nbsp;startTime:&nbsp;&#39;2012/12/09&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开始时间，必须使用斜线（禁止&nbsp;2012-12-09&nbsp;格式），它没有兼容性问题<br/>&nbsp;&nbsp;&nbsp;&nbsp;sessionTimes:&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一次登录内，显示几次，默认是1次<br/>&nbsp;&nbsp;}<br/>&nbsp;<br/>&nbsp;&nbsp;本组件可以实现一个页面的多个新功能提示。之前的设想是显示完一个再显示另一个，每个气泡显示1分钟，但<br/>&nbsp;&nbsp;是极有可能用户看了几秒就直接跳转了，导致后面的气泡都看不到了。所以改成可同时显示，为了体验好一些<br/>&nbsp;&nbsp;，当然不能同时显示一堆气泡。。。<br/>&nbsp;<br/>&nbsp;&nbsp;用法：<br/>&nbsp;&nbsp;1.&nbsp;定义你需要的source，可以基于模版定制，有三个模版：info(叹号)&nbsp;help(问号)&nbsp;tip(新功能提示)<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bubble.source.xx&nbsp;=&nbsp;Bubble.getSource(&#39;info&#39;,&nbsp;{&nbsp;title:&nbsp;&#39;&#39;,&nbsp;content:&nbsp;&#39;&#39;&nbsp;});<br/>&nbsp;<br/>&nbsp;&nbsp;2.&nbsp;如果是从模版自动生成的气泡，如右:&nbsp;_ui=&quot;id:xx;type:Bubble;source:xx;&quot;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;&nbsp;3.&nbsp;如果是手动创建的气泡，如下:<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;var&nbsp;bubble&nbsp;=&nbsp;new&nbsp;fc.ui.Bubble(elem,&nbsp;{&nbsp;source:&nbsp;&#39;xx&#39;&nbsp;})
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
