// =============================================================================
// SETUP
// =============================================================================

// ------------------------------------
// GET DEPENDENCIES
// ------------------------------------
var mongoose = require('mongoose'),       //lets us use an easier mongo framework
    Schema   = mongoose.Schema,           //lets us create a schema for mongo
    bcrypt   = require('bcrypt-nodejs');  //lets us hash and check passwords

// ------------------------------------
// CREATE THE SCHEMA
// ------------------------------------
var UserSchema = new Schema({
    name: {
      type: String
    },
    username: {
      type: String,
      required: true,           //required
      index: { unique: true }   //unique in the database
    },
    password: {
      type: String,
      required: true,
      select: false             //excluded from query results
    }
});


// =============================================================================
// METHODS
// =============================================================================

// ------------------------------------
// MONGOOSE SCHEMA MIDDLEWARE
// ------------------------------------
// hash the password before the user is saved
UserSchema.pre('save', function(next) {
  var user = this;

  // hash the password iff the user is new or the password has been changed
  if (!user.isModified('password')) return next();

  // hash the password
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);

    // store the hashed password in the database
    user.password = hash;

    // pass off to the next middleware in line
    next();
  });
});

// ------------------------------------
// CUSTOM METHODS
// ------------------------------------
// for when the user wants to log in/etc, verify the password they supply
// compare the given password to the database hash, return T/F
UserSchema.methods.comparePassword = function(password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};


// =============================================================================
// RETURN THE MODEL
// =============================================================================

module.exports = mongoose.model('User', UserSchema);
