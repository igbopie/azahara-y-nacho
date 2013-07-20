
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , message = require('./routes/message')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , models = require('./models')
  , messageSockets = require('./messagesockets');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('db-uri',process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost:27017/azaharaynacho");
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Define Models
models.defineModels(mongoose,app);

// Define Routes
app.get('/', routes.index);
app.get('/messages', message.list);
app.get('/users', user.list);

// Create Servers
var server = http.createServer(app); 

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// Create "websocket" server
messageSockets.createServer(server,app);




