
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , message = require('./routes/message')
  , http = require('http')
  , path = require('path');
var MessageProvider = require('./messageprovider-db').MessageProvider;
var messageProvider= new MessageProvider("localhost","27017");
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
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

app.get('/', routes.index);
app.get('/messages', message.list);
app.get('/users', user.list);

var server = http.createServer(app); 

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



//--------------------
//Web sockets app
//--------------------
/**
 * Global variables
 */
// latest 100 messages
var history = [ ];
// list of currently connected clients (users)
var clients = [ ];
/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Array with some colors
var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
// ... in random order
colors.sort(function(a,b) { return Math.random() > 0.5; } );



var io = require('socket.io').listen(server);
//HEROKU
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.on('connection', function (socket) {
    console.log((new Date()) + ' Connection from origin ' + socket + '.');

   
    var index = clients.push(socket) - 1;
    var userName = false;
    var userColor = false;

    console.log((new Date()) + ' Connection accepted.');

	messageProvider.findAll(function(error, results){
		socket.emit('history',results);
	});
    	

	  // user sent some message
    socket.on('setname', function(message) {
     	// remember user name
            userName = htmlEntities(message);
            // get random color and send it back to the user
            userColor = colors.shift();
            
            socket.emit('color',userColor);
            console.log((new Date()) + ' User is known as: ' + userName
                        + ' with ' + userColor + ' color.');

    });
    // user sent some message
    socket.on('message', function(message) {
        console.log((new Date()) + ' Received Message from '
                    + userName + ': ' + message);
        
        // we want to keep history of all sent messages
        var obj = {
            time: (new Date()).getTime(),
            text: htmlEntities(message),
            author: userName,
            color: userColor
        };
        messageProvider.save(obj,function(){
	       for (var i=0; i < clients.length; i++) {
            clients[i].emit('message',obj);
			} 
        });
        
        
	});

    // user disconnected
    socket.on('close', function(connection) {
        if (userName !== false && userColor !== false) {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            clients.splice(index, 1);
            // push back user's color to be reused by another user
            colors.push(userColor);
        }
    });

});





