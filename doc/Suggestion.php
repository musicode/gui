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
            var propertyData = [{ name: getProperty('input', 'Input', '输入框组件') },{ name: getProperty('list', 'List', '列表组件') },{ name: getProperty('opened', 'boolean', '提示项是否处于展开显示状态') },{ name: getProperty('text', 'string', '用户手动输入的文本，非提示词') }],
            methodData = [{ name: getMethod('close', [], 'void', '关闭提示层') },{ name: getMethod('getTpl', [], 'void', '') },{ name: getMethod('open', [{ name: 'config', type: 'Object', desc: '可选，List&nbsp;组件的配置' }], 'void', '打开提示层<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;有时可能需要打开一个不那么一样的提示层<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;因此可以通过&nbsp;config&nbsp;参数进行设置<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;具体设置可以参考&nbsp;fc.ui.List&nbsp;组件的配置说明<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;需要注意的是，config.data&nbsp;数组元素必须包含&nbsp;text&nbsp;字段') },{ name: getMethod('placeholder', [{ name: 'value', type: 'string', desc: '' }], 'string|void', '获取或设置&nbsp;placeholder') },{ name: getMethod('value', [{ name: 'value', type: 'string', desc: '' }], 'string', '获取或设置输入框的值') }],
            eventData = [{ name: getEvent('onblur', [{ name: 'value', type: 'string', desc: '输入框的文本' }], '输入框失焦触发') },{ name: getEvent('onchange', [{ name: 'value', type: 'string', desc: '输入框的文本' }], '输入框内容变化时触发') },{ name: getEvent('onfocus', [{ name: 'value', type: 'string', desc: '输入框的文本' }], '输入框聚焦触发') },{ name: getEvent('onsubmit', [{ name: 'value', type: 'string|Object', desc: '如果鼠标点击某个提示项，value&nbsp;是&nbsp;object;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果回车或别的什么方式触发，value&nbsp;是&nbsp;string' }], '鼠标点击提示项或回车触发') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Suggestion</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            Suggestion组件<br/>&nbsp;<br/>&nbsp;&nbsp;考虑到输入框的样式不同,&nbsp;输入框的高度无法固定<br/>&nbsp;&nbsp;因此提示层的&nbsp;top&nbsp;属性需要自定义<br/>&nbsp;&nbsp;<br/>&nbsp;&nbsp;Suggestion&nbsp;组件考虑过提示词超长的情况<br/>&nbsp;&nbsp;并用&nbsp;css&nbsp;截断处理，因此使用时无需用&nbsp;js&nbsp;截断<br/>&nbsp;&nbsp;而且组件选中某个提示项是通过&nbsp;innerHTML&nbsp;方式获取值<br/>&nbsp;&nbsp;如果使用&nbsp;js&nbsp;截断，会导致拿到的值不完整<br/>&nbsp;<br/>&nbsp;&nbsp;如果需要改变&nbsp;input&nbsp;的大小，别用&nbsp;height，应该用&nbsp;pading-top&nbsp;和&nbsp;padding-bottom<br/>&nbsp;&nbsp;这样没有兼容性问题<br/>&nbsp;&nbsp;<br/>&nbsp;&nbsp;配置项如下：<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;读取数据的方法，返回的数据通过&nbsp;callback&nbsp;的参数传入，注意必须是个数组，结构如下：<br/>&nbsp;&nbsp;&nbsp;&nbsp;[&nbsp;{&nbsp;text:&nbsp;&#39;显示的文本&#39;&nbsp;},&nbsp;...&nbsp;]<br/>&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;只是要确保有&nbsp;text&nbsp;字段即可<br/>&nbsp;&nbsp;&nbsp;&nbsp;如果需要更多属性，随便加就行，当鼠标点击其中某项时，onsubmit&nbsp;第一个参数会返回对应的对象<br/>&nbsp;&nbsp;&nbsp;&nbsp;request:&nbsp;function(callback)&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;}<br/>&nbsp;&nbsp;}
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
