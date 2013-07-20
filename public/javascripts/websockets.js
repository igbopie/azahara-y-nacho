$(function () {
    "use strict";

    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');

    // my color assigned by the server
    var myColor = false;
    // my name sent to the server
    var myName = false;

   
   var sio = io.connect('http://'+window.location.host);
   sio.socket.on('error', function (reason){
   		// just in there were some problems with conenction...
   		content.html($('<p>', { text: 'Lo siento pero hubo algún problema con tu conexión o tu servidor está apagado' } ));
   });
   sio.on('connect', function (){
   
        // first we want users to enter their names
        input.removeAttr('disabled');
		status.text('Pon tu nombre:');
   
   });
    
    sio.on('message',function (message) {
       input.removeAttr('disabled'); // let the user write another message
       addMessage(message.author, message.text,
                   message.color, new Date(message.time));
       
    });
    
    sio.on('color',function (message) {
       myColor = message;
       status.text(myName + ': ').css('color', myColor);
       input.removeAttr('disabled').focus();
       // from now user can start sending messages
    });
    
    sio.on('history',function (message) {
       // insert every single message to the chat window
       for (var i=0; i < message.length; i++) {
            addMessage(message[i].author,message[i].text,
                       message[i].color, new Date(message[i].time));
       }
        
    });

    /**
     * Send mesage when user presses Enter key
     */
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            
            // we know that the first message sent from a user their name
            if (myName === false) {
                myName = msg;
                sio.emit("setname",myName);
                // disable the input field to make the user wait until server
				// sends back response
            	input.attr('disabled', 'disabled');
            }else{
	            // send the message as an ordinary text
				sio.emit("message",msg);
            }
            
            $(this).val('');
            

            
        }
    });

    /**
     * Add message to the chat window
     */
    function addMessage(author, message, color, dt) {
        content.prepend('<p><span style="color:' + color + '">' + author + '</span> @ ' +
             + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
             + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
             + ': ' + message + '</p>');
    }
});