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
            var propertyData = [{ name: getProperty('selectButton', 'Button', '选择文件按钮') }],
            methodData = [{ name: getMethod('disable', [], 'void', '') },{ name: getMethod('formatConfig', [], 'void', '') },{ name: getMethod('getFile', [], 'Object', '获得上传文件') },{ name: getMethod('getTpl', [], 'void', '') },{ name: getMethod('info', [{ name: 'text', type: 'string', desc: '' },{ name: 'type', type: 'string', desc: '可选。提示类型，取值为&nbsp;Upload.STATUS_&nbsp;打头的常量' }], 'void', '设置提示信息') },{ name: getMethod('reset', [], 'void', '') }],
            eventData = [{ name: getEvent('onfail', [], '上传失败时出发') },{ name: getEvent('onsuccess', [], '上传成功时触发') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Upload</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            上传组件<br/>&nbsp;<br/>&nbsp;&nbsp;配置项如下:<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;url:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;服务器上传地址。必须是绝对路径<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;text:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认的提示文本<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;types:&nbsp;[],&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;可选。指定的文件类型<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;desc:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选择文件窗口的描述，比如&nbsp;&quot;请选择文本文件&quot;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;size:&nbsp;1024,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最大多少&nbsp;kb<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;error:&nbsp;&#39;&#39;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果设置了&nbsp;size，再设置超出大小的提示文本<br/>&nbsp;&nbsp;}
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
