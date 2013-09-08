var crypto = require('crypto'),
	Message,
    User;
				
function defineModels(mongoose, app) {
  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

  /**
    * Model: Message
    */
  Message = new Schema({
    'author': String,
    'text': String,
    'color': String,
    'time': Date,
    'user_id': ObjectId
  });

  Message.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

  Message.pre('save', function(next) {
  	//TODO validation
    next();
  });
  
  mongoose.model('Message', Message);
  app.Message = mongoose.model('Message');

  /**
    * Model: User
    */
  function validatePresenceOf(value) {
    return value && value.length;
  }

  User = new Schema({
    'email': { type: String, validate: [validatePresenceOf, 'an email is required'], index: { unique: true } },
    'hashed_password': String,
    'salt': String,
    'name': String,
    'lastname': String,
    'active': Boolean
  });

  User.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

  User.virtual('password')
    .set(function(password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._password; });

  User.method('authenticate', function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  });
  
  User.method('makeSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  });

  User.method('encryptPassword', function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  });

  User.pre('save', function(next) {
    if (!validatePresenceOf(this.password)) {
      next(new Error('Invalid password'));
    } else {
      next();
    }
  });
  
  mongoose.model('User', User);
  app.User = mongoose.model('User');


  db = mongoose.connect(app.set('db-uri'));
  

}

exports.defineModels = defineModels; 