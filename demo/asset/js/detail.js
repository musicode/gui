var TPL_PROPERTY = '<h1 class="property">'
                 +     '<span class="name">{{name}}</span> : <span class="type">{{type}}</span>'
                 + '</h1>'
                 + '<p class="desc">{{&desc}}</p>';

var TPL_METHOD = '<h1 class="method">'
               +     '<span class="name">{{name}}</span> ({{#hasList}} {{&arguments}} {{/hasList}})'
               +     ': <span class="returnType">{{returnType}}</span>'
               
               + '{{#hasList}}'
               + '<button class="collapse-btn" type="button" title="参数详情"></button>'
               + '{{/hasList}}'

               + '</h1>'
               + '<p class="desc">{{&desc}}</p>'

               + '{{#hasList}}'
               + '<div class="param-list">'
               +     '<ul>'

               + '{{#list}}'
               + '<li>- <span class="name">{{name}}</span> : <span class="desc">{{&desc}}</span></li>'
               + '{{/list}}'

               +     '</ul>'
               + '</div>'
               + '{{/hasList}}';

var TPL_EVENT = '<h1 class="event">'
              +     '<span class="name">{{event}}</span>'
              + '</h1>'
              + '<p class="desc">{{&desc}}</p>';

var TPL_ARG = '<span class="param">{{name}}</span> : <span class="type">{{type}}</span>';

var C_PROPERTY = Hogan.compile(TPL_PROPERTY);
var C_METHOD = Hogan.compile(TPL_METHOD);
var C_EVENT = Hogan.compile(TPL_EVENT);

var C_ARG = Hogan.compile(TPL_ARG);

function parseProperty(prop) {
    return C_PROPERTY.render(prop);
}

function parseMethod(method) {
    var html = [ ];
    var args = method.arguments;

    fc.each(args, function(argv) {
        html.push(C_ARG.render(argv));
    });

    method.hasList = args.length > 0;

    method.list = method.hasList && args;
    method.arguments = html.join(', ');

    return C_METHOD.render(method);
}

function parseEvent(event) {
    return parseMethod(event);
}

function createTable(config) {
    var elem = $('#' + config.id)[0];
    var section = $(elem).parent();
    
    var data = config.data;
    if (data.length > 0) {
        var table = new fc.ui.Table(elem, config);
        table.render(data);
        section.height(table.height());
    } else {
        section.hide();
    }
}


$(function() {

    $('header h1').html(json.name);
    $('section > .intro').html(json.desc);

    var config = {
        propertys: {
            id: 'propertys',
            columns: [{
                field: 'name',
                title: '<a name="property"></a>属性',
                content: function(data) {
                    return parseProperty(data);
                }
            }],
            data: json.propertys
        },
        methods: {
            id: 'methods',
            columns: [{
                field: 'name',
                title: '<a name="method"></a>方法',
                content: function(data) {
                    return parseMethod(data);
                }
            }],
            data: json.methods
        },
        events: {
            id: 'events',
            columns: [{
                field: 'name',
                title: '<a name="event"></a>事件',
                content: function(data) {
                    return parseEvent(data);
                }
            }],
            data: json.events
        }
    };
    
    for (var key in config) {
        createTable(config[key]);
    }

    $('.collapse-btn').click(function() {
        $('.param-list', this.parentNode.parentNode).slideToggle(300);
        $(this).toggleClass('close');
    });
});
