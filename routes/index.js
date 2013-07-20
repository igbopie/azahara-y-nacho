
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.registerGet = function (req, res){
  res.render('register', {user:{}});
}
exports.registerPost = function (req, res){
  var user = req.app.User(req.body.user);
  user.save(function(err){
	  if(err){
		  res.render('register', {user:user,error:err});
	  }else{
		  res.render('ok', { });
	  }
	  
  });
  
}

