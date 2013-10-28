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
            var propertyData = [{ name: getProperty('data', 'Array', '跑马灯的数据') },{ name: getProperty('pageData', 'Array', '当前页的数据') },{ name: getProperty('pageable', 'boolean', '是否可以翻页，即总页数是否大于&nbsp;1') },{ name: getProperty('playing', 'boolean', '是否正在自动播放（自动翻页）') },{ name: getProperty('selectedData', 'Object', '当前选中的数据') }],
            methodData = [{ name: getMethod('dispose', [], 'void', '') },{ name: getMethod('formatConfig', [], 'void', '') },{ name: getMethod('getTpl', [], 'void', '') },{ name: getMethod('isLastPage', [], 'boolean', '是否是最后一页') },{ name: getMethod('items', [{ name: 'data', type: 'Array', desc: '' }], 'Array', '获取或设置滚动项') },{ name: getMethod('nextPage', [], 'void', '翻到下一页<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;翻到最后一页时，下一页操作会转到第&nbsp;0&nbsp;页') },{ name: getMethod('page', [{ name: 'index', type: 'number', desc: '第几页,&nbsp;从&nbsp;0&nbsp;开始计数' }], 'numberd', '翻到第&nbsp;index&nbsp;页，或者获取当前是第几页<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果&nbsp;index&nbsp;小于第一页，重置为第一页<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果&nbsp;index&nbsp;大于最后一页,&nbsp;重置为最后一页') },{ name: getMethod('play', [], 'void', '开启自动播放') },{ name: getMethod('prevPage', [], 'void', '翻到上一页<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;翻到第&nbsp;0&nbsp;页时，上一页操作会转到最后一页') },{ name: getMethod('stop', [], 'void', '停止自动播放') }],
            eventData = [{ name: getEvent('onclick', [{ name: 'data', type: 'Object|string', desc: '选中的数据' },{ name: 'target', type: 'HTMLElement', desc: '点击的元素' }], '点击某一项时触发') },{ name: getEvent('onpage', [{ name: 'page', type: 'number', desc: '表示当前翻到第几页，索引从0开始' }], '翻页触发') }];

        </script>
        
    </head>
    <body>
        
        <header>
            <h1>Marquee</h1>
            <ul>
                <li><a href="#property">属性</a></li>
                <li><a href="#method">方法</a></li>
                <li><a href="#event">事件</a></li>
            </ul>
        </header>
        
        <section>
            <p class="intro">
            跑马灯<br/>&nbsp;<br/>&nbsp;&nbsp;配置项如下：<br/>&nbsp;&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;field:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;调用&nbsp;items()&nbsp;传入的数组对象使用的字段名<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;比如&nbsp;items([{&nbsp;id:&nbsp;0,&nbsp;name:&nbsp;&#39;名称&#39;&nbsp;}])&nbsp;是&nbsp;name<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注意：如果未设置此项，items()&nbsp;的参数只能是&nbsp;[&#39;str1&#39;,&nbsp;&#39;str2&#39;,&nbsp;&#39;str3&#39;]&nbsp;的形式<br/>&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;labelText:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提示语，如“请选择关键词”<br/>&nbsp;&nbsp;&nbsp;&nbsp;labelTip:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;提示语的tip&nbsp;(&nbsp;元素的title&nbsp;)<br/>&nbsp;&nbsp;&nbsp;&nbsp;pageSize:&nbsp;10,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;每页显示几项<br/>&nbsp;&nbsp;&nbsp;&nbsp;maxWidth:&nbsp;100,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;每项的最大宽度，单位统一是px，如果未设置则完整显示<br/>&nbsp;&nbsp;&nbsp;&nbsp;pageText:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;翻页部分的说明文字<br/>&nbsp;&nbsp;&nbsp;&nbsp;autoPage:&nbsp;1000,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果需要自动翻页，通过此参数设置翻页间隔，单位毫秒<br/>&nbsp;&nbsp;&nbsp;&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;//&nbsp;下面这几个需求有点变态，就是翻到第一页或最后一页时，是否继续可翻页<br/>&nbsp;&nbsp;&nbsp;&nbsp;firstPageable:&nbsp;true,&nbsp;翻到第一页是否可继续翻页<br/>&nbsp;&nbsp;&nbsp;&nbsp;lastPageable:&nbsp;true,&nbsp;&nbsp;翻到最后一页是否可继续翻页<br/>&nbsp;&nbsp;&nbsp;&nbsp;firstTip:&nbsp;&#39;&#39;,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在&nbsp;firstPageable&nbsp;为&nbsp;true&nbsp;时，前翻按钮的&nbsp;tip&nbsp;（一般用来引导用户翻页）<br/>&nbsp;&nbsp;&nbsp;&nbsp;lastTip:&nbsp;&#39;&#39;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在&nbsp;lastPageable&nbsp;为&nbsp;true&nbsp;时，后翻按钮的&nbsp;tip<br/>&nbsp;&nbsp;}<br/>&nbsp;<br/>&nbsp;&nbsp;如果需要给每个&nbsp;item&nbsp;的右侧加边框,&nbsp;请参考下例(你没看错，是&nbsp;border-left)：<br/>&nbsp;&nbsp;.marquee-slider&nbsp;li&nbsp;{<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;border-left:&nbsp;1px&nbsp;solid&nbsp;red;<br/>&nbsp;&nbsp;}
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
