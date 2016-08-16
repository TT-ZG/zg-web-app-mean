// =============================================================================
// =============================================================================
// get dependencies
var mongoose  = require('mongoose'),
		Schema    = mongoose.Schema,
		bcrypt 	  = require('bcrypt-nodejs');

// =============================================================================
// =============================================================================
// brother schema, password is NOT returned on mongoose queries
var brotherSchema   = new Schema({
	username: {
		type: String,
		required: true,
		index: { unique: true }
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	roll: {
		type: Number,
		required: true,
		index: { unique: true }
	},
	name: {
		type: String,
		required: true
	},
	pledgeClass: {
		type: String,
		required: true
	},
	major: {
		type: String,
		required: true
	},
	available: {
		type: String ,
		enum: ['Unavailable', 'Full-Time', 'Part-Time', 'Internship'],
		required: true
	},
	standing: {
		type: String ,
		enum: ['Active', 'Alumni'],
		required: true
	},
	graduation: {
		type: Date,
	},
	gpa: {
		type: String,
		enum: ['3.00 - 3.32', '3.33 - 3.66', '3.67 - 4.00', 'On Request'],
		required: true
	},
	picture: {
		type: String,
		required: true,
		default: '0.jpg'},
	internships: [{
		id: Number,
		name: String
	}],
	created_at: Date,
  updated_at: Date
});

// =============================================================================
// =============================================================================
// set times and hash password before saving
brotherSchema.pre('save', function(next) {

  var brother = this;

  // get and set the current time
  var currentTime = new Date();
  brother.updated_at = currentTime;
  if(!this.created_at) this.created_at = currentTime;

  // hash the password only if the password has been changed or user is new
  if (!brother.isModified('password')){
		return next();
	}

  // generate the hash
	bcrypt.hash(brother.password, null, null, function(err, hash) {

		if (err){
			return next(err);
		}

		// change the password to the hashed version
		brother.password = hash;
		next();
	});
});

// =============================================================================
// =============================================================================
// method to compare a given password with the database hash
brotherSchema.methods.comparePassword = function(password) {
	var brother = this;
	return bcrypt.compareSync(password, brother.password);
};

// =============================================================================
// =============================================================================
// export
var Brother = mongoose.model('Brother', brotherSchema);
module.exports = Brother;
