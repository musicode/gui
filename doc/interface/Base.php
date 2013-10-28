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
            var propertyData = [{ name: getProperty('dead', 'boolean', '是否已死<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;组件销毁后会标识为&nbsp;true') },{ name: getProperty('name', 'string', '组件名称，用于标识是什么组件') },{ name: getProperty('node', 'HTMLElement', '组件最外层元素') },{ name: getProperty('visible', 'boolean', '是否可见') }],
            methodData = [{ name: getMethod('config', [{ name: 'config', type: 'Object|string', desc: '' },{ name: 'value', type: 'Object', desc: '可选' }], 'Object', '获取或设置配置<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;也可以单项读写') },{ name: getMethod('dispose', [], 'void', '释放内存') },{ name: getMethod('find', [{ name: 'selector', type: 'string', desc: '选择器' }], 'Array', '查找组件内部的某个元素') },{ name: getMethod('fire', [{ name: 'e', type: 'Object|string', desc: '如果是&nbsp;Object，硬件要求是必须有&nbsp;type&nbsp;属性，标识事件类型;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果是&nbsp;string，已标识事件类型' }], 'void', '发出事件') },{ name: getMethod('height', [{ name: 'value', type: 'number', desc: '可选，不传表示getter，传值表示setter' }], 'number', '获取或设置组件的高度') },{ name: getMethod('hide', [], 'void', '隐藏组件') },{ name: getMethod('on', [{ name: 'type', type: 'string', desc: '事件类型' },{ name: 'handler', type: 'Function', desc: '事件处理函数' },{ name: 'selector', type: 'string|boolean', desc: '此参数专为&nbsp;DOM&nbsp;事件服务<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果是事件代理，这是选择器;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果不是事件代理，传&nbsp;true&nbsp;标识这是&nbsp;DOM&nbsp;事件' },{ name: 'scope', type: 'Object', desc: '函数的&nbsp;this&nbsp;默认指向当前组件，也可以通过&nbsp;scope&nbsp;参数设置' }], 'void', '侦听事件<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;支持&nbsp;DOM&nbsp;事件或自定义事件') },{ name: getMethod('reset', [{ name: 'config', type: 'Object', desc: '可选，组件的配置对象' }], 'void', '重新初始化组件<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;有可能更新过配置信息，需要刷新组件') },{ name: getMethod('show', [], 'void', '显示组件') },{ name: getMethod('skin', [{ name: 'name', type: 'string', desc: '皮肤名称' }], 'string', '获取或设置皮肤') },{ name: getMethod('width', [{ name: 'value', type: 'number', desc: '可选，不传表示getter，传值表示setter' }], 'number', '获取或设置组件的宽度') }],
            eventData = [{ name: getEvent('onhide', [], '组件隐藏时触发') },{ name: getEvent('onresize', [], '子类如果有&nbsp;resize&nbsp;需要，请实现此方法') },{ name: getEvent('onshow', [], '组件显示时触发') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Base</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            UI&nbsp;组件基类
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
