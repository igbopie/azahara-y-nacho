var MessageProvider = require('../messageprovider-memory').MessageProvider;
var messageProvider= new MessageProvider();

/*
 * GET messages listing.
 */
exports.list = function(req, res){
  messageProvider.findAll(function(error, docs){
      res.send(docs);
  });
};