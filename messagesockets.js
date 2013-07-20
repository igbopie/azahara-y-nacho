var iolib = require('socket.io');

//--------------------
//Web sockets app
//--------------------
function createServer(httpServer,app){
	
	// list of currently connected clients (users)
	var clients = [ ];
	
	// Array with some colors
	var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
	// ... in random order
	colors.sort(function(a,b) { return Math.random() > 0.5; } );

	var io = iolib.listen(httpServer);
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

	app.Message.find({},function(error, results){
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
        
        var m = new app.Message(obj);
        
        
        m.save(function(){
	       for (var i=0; i < clients.length; i++) {
            clients[i].emit('message',m);
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

}


/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


exports.createServer = createServer;
