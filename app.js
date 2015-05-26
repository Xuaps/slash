var express = require('express')
  , favicon = require('serve-favicon')
  , refly_router = require('./routes/refly')
  , authentication_router = require('./routes/authentication.js')
  , http = require('http')
  , path = require('path')
  , morgan = require('morgan')
  , errorhandler = require('errorhandler')
  , staticAsset = require('static-asset')
  , config = require('config')
  , airbrake = require('airbrake').createClient('0eb2891adfa08afa30a7526ca1173596')
  , toll = require('./routes/express-toll.js')
  , passport = require('passport')
  , session = require('cookie-session')
  , random_values = require('./app/random-values.js');

var app = express();
var env = process.env.NODE_ENV || 'development';

if ('development' == env) {
  app.use(morgan('dev'));
}
app.set('port', config.serverConfig.port);
app.set('ipaddr', config.serverConfig.ip);
app.set('views', './views');
app.set('view engine', 'jade');

/*** static resources ***/
app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));

/* middlewares */
app.use(session({name: 'rl', secret: config.cookies.secret, maxAge: 2419200000}));
app.use(passport.initialize());
app.use(airbrake.expressHandler());
app.use(new toll({route: '/api/references/:docset/:uri*'
            , exclude: ['/api/references/:docset/:uri*/c&b','/api/references/:docset/:uri*/hierarchy']},
            function(){return random_values.boolean.weighted(92);}, "Payment required.").activate());

/* routes */
app.use(authentication_router);
app.use(refly_router);

/* general */
app.use('/', function(req, res){
    res.render('index', {environment: env});
});   

/*errors*/
if ('development' == env) {
    app.use(errorhandler());
}else{
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

http.createServer(app).listen(app.get('port'), app.get('ipaddr'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

