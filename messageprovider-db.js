var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


MessageProvider = function(host, port){
	this.db= new Db('azaharaynacho', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
	this.db.open(function(){});
};

MessageProvider.prototype.getCollection= function(callback) {
  this.db.collection('messages', function(error, message_collection) {
    if( error ) callback(error);
    else callback(null, message_collection);
  });
};



//find all messages
MessageProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, message_collection) {
      if( error ) callback(error)
      else {
        message_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new messages
MessageProvider.prototype.save = function(messages, callback) {
    this.getCollection(function(error, message_collection) {
      if( error ) callback(error)
      else {
        if( typeof(messages.length) == "undefined")
          messages = [messages];

        for( var i =0;i< messages.length;i++ ) {
          message = messages[i];
          message.created_at = new Date();
        }

        message_collection.insert(messages, function() {
          callback(null, messages);
        });
      }
    });
};



exports.MessageProvider = MessageProvider;