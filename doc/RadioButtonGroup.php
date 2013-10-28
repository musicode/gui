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
            methodData = [{ name: getMethod('addRadioButton', [{ name: 'radioButton', type: 'RadioButton', desc: '单选按钮组件' }], 'void', '添加一个单选按钮') }],
            eventData = [{ name: getEvent('onchange', [], '组内选中的RadioButton&nbsp;发生变化时触发') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>RadioButtonGroup</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            RadioButton&nbsp;容器<br/>&nbsp;&nbsp;[TODO]
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
