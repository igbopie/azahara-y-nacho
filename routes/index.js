var randomString = require('random-string');
var nodemailer = require('nodemailer');
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
  var pass = randomString({length: 8});
  user.password = pass;
  user.save(function(err){
	  if(err){
		  	res.render('register', {user:user,error:err});
	  }else{
	  	  	//Send Email
	  	  	var transport = nodemailer.createTransport("sendmail");
	  	  	// setup e-mail data with unicode symbols
	  	  	var mailOptions = {
			    from: "myemail@email.com", // sender address
			    to: user.username, // list of receivers
			    subject: "Bienvenido a Azahara y nacho ✔", // Subject line
			    text: "Bienvenido a Azahara y Nacho: Tu email: "+user.email+". Tu Password: "+user.password+".", // plaintext body
			    html: "<b>Bienvenido a Azahara y Nacho</b><br />Tu email: "+user.email+".<br /> Tu Password: "+user.password+".",
			}
			
			// send mail with defined transport object
			transport.sendMail(mailOptions, function(error, response){
			    if(error){
			        console.log(error);
			    }else{
			        console.log("Message sent: " + response.message);
			    }
			
			    // if you don't want to use this transport object anymore, uncomment following line
			    //smtpTransport.close(); // shut down the connection pool, no more messages
			});
			console.log("User Created:  user:" + user.email+" password:"+user.password);
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
