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
            methodData = [{ name: getMethod('add', [{ name: 'ui', type: 'Base', desc: '组件的实例' }], 'void', '新创建一个需要遮罩的组件') },{ name: getMethod('remove', [{ name: 'ui', type: 'Base', desc: '组件的实例' }], 'void', '销毁组件需要更新遮罩') }],
            eventData = [];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Mask</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            遮罩（单例）<br/>&nbsp;&nbsp;<br/>&nbsp;&nbsp;设计思路：<br/>&nbsp;&nbsp;比如&nbsp;Dialog&nbsp;和&nbsp;Alert，下方会带有一层遮罩<br/>&nbsp;&nbsp;如果出现&nbsp;Dialog&nbsp;中弹出&nbsp;Alert&nbsp;的情况，有两种解决办法：<br/>&nbsp;&nbsp;1.&nbsp;每弹出一个，就新建一个遮罩<br/>&nbsp;&nbsp;2.&nbsp;共用一个遮罩，每弹出一个就改变一下遮罩的&nbsp;zIndex<br/>&nbsp;<br/>&nbsp;&nbsp;这里采用的是第二种办法，所以需要有一个单例类来管理遮罩
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
