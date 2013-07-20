var Message;
				
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


  db = mongoose.connect(app.set('db-uri'));
  
  app.Message = mongoose.model('Message');

}

exports.defineModels = defineModels; 