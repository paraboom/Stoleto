var express = require('express');
var FormHandler = require('./form_handler.js').FormHandler;

var app = module.exports = express.createServer();

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.compiler({
        src: __dirname + '/public/less',
        enable: ['less']
    }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

var formHandler = new FormHandler();

app.get('/', function(req, res) {
    formHandler.findAll(function(error, docs){
        res.send(docs);
    });
});

app.listen(process.env.PORT);