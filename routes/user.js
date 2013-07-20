
/*
 * GET users listing.
 */

exports.list = function(req, res){
  req.app.User.find({},function(error, docs){
      res.send(docs);
  });
};