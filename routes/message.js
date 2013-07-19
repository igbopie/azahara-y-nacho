var MessageProvider = require('../messageprovider-db').MessageProvider;
var messageProvider= new MessageProvider("localhost","27017");

/*
 * GET messages listing.
 */
exports.list = function(req, res){
  messageProvider.findAll(function(error, docs){
      res.send(docs);
  });
};