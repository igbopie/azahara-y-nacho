var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var url = require('url');

var MongoClient = require('mongodb').MongoClient;
var MONGO_URL = process.env.MONGOLAB_URI || 
				process.env.MONGOHQ_URL || "mongodb://localhost:27017/azaharaynacho";

var connectionUri = url.parse(MONGO_URL);
var dbName = connectionUri.pathname.replace(/^\//, '');

MessageProvider = function(){
	//this.db= new Db('azaharaynacho', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
	//this.db.open(function(){});	
	var me = this;
	 MongoClient.connect(MONGO_URL, function(error, db) {
	 	 if( error ){
		 	 //Could not connect
	 	 }else{
		 	 me.db = db;
	 	 }
	 });
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