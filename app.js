var express = require('express')
  , favicon = require('serve-favicon')
  , docsets = require('./routes/docsets')
  , api = require('./app/api.js')
  , http = require('http')
  , path = require('path')
  , config = require('config')
  , hal = require('express-hal');

var app = express();

app.configure(function(){
  app.set('port', config.serverConfig.port);
  app.set('ipaddr', config.serverConfig.ip);
  app.set('view engine', 'jade');
  app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(hal.middleware);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(function(req, res){
        res.set('Content-Type', 'text/html');
        res.sendfile('public/index.html');
    });   
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/api', function(req, res){
    res.set('Content-Type', 'application/hal+json');
    res.hal(api.entry());
});
app.get('/api/references/:docset/:uri(*)', function(req, res){
    api.get_reference(req.params.docset, req.params.uri)
        .then(function(hal){
            res.set('Content-Type', 'application/hal+json');
            res.hal(hal);
        });
});
app.get('/api/references?', docsets.search);
app.get('/api/docsets?', docsets.get_docsets);
app.get('/api/types', docsets.get_types);
app.get('/api/referencesbranch/:uri(*)', docsets.branch);
app.get('/api/referencesbreadcrumbs/:uri(*)', docsets.breadcrumbs);

http.createServer(app).listen(app.get('port'), app.get('ipaddr'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

