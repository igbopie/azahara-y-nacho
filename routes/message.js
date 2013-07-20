/*
 * GET messages listing.
 */
exports.list = function(req, res){
  req.app.Message.find({},function(error, docs){
      res.send(docs);
  });
};
