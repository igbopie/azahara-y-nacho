
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};


exports.loginGet = function (req, res){
	if(req.session.user_id != null){
		res.redirect('/profile');
	}else{
		res.render('login', {username:"",password:""});
	}
}
exports.loginPost = function (req, res){

  req.app.User.findOne({ email: req.body.username }, function(err, user) {
    if (user && user.authenticate(req.body.password)) {
      req.session.user_id = user.id;
	  res.redirect('/profile');
      
    } else {
      res.render('login', {username:req.body.username,password:"",error:"Pues no"});
    
    }
  }); 
}

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


exports.profileGet = function (req, res){
	req.app.User.findOne({_id:req.session.user_id},function(err, user) {
		if(err){
		  	res.redirect('/register');
		}else{
			res.render('profile', {user:user,error:"Todo correcto",user_id:req.session.user_id});
		}

	});
}
