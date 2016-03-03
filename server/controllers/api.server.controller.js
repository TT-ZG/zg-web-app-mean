// =============================================================================
// =============================================================================
// get dependencies
var mongoose    = require('mongoose'),
    bodyParser 	= require('body-parser'),
    jwt        	= require('jsonwebtoken'),
    Brothers    = require('../models/api.server.model.js'),
    config      = require('../config/config.js'),
    morgan      = require('morgan'),
    superSecret = config.secret,
    fs          = require('fs'),
    Grid        = require('gridfs-stream');

// =============================================================================
// =============================================================================
// open gridFS
var conn = mongoose.connection,
    gfs  = {};
Grid.mongo = mongoose.mongo;
conn.once('open', function() {
  console.log('GridFS connected');
  gfs = Grid(conn.db);
});

// =============================================================================
// =============================================================================
// Users post to api/authenticate to get a token
exports.authenticate = function(req, res) {

  // find by username as these are unique
  Brothers.findOne({ username: req.body.username })
  .select('name username password')
  .exec(function(err, brother) {
    // throw error if any
    if (err)
      throw err;

    // if not found, return false
    if (!brother)
      res.json({ success: false, message: 'User not found.' });

    else if (brother) {
      // check passwords
      var validPassword = brother.comparePassword(req.body.password);
      if (!validPassword)
        res.json({ success: false, message: 'Wrong password.' });

      // sign a token if all is OK
      else {
        var token = jwt.sign({
          name: brother.name,
          username: brother.username },
          superSecret,
          {expiresInMinutes: 1440});
        res.json({ success: true, message: 'OK.', token: token });
      }
    }
  });
};

// =============================================================================
// =============================================================================
// GET api/brothers
exports.brothers = function(req, res) {
  Brothers.find()
  .sort('name')
  .exec(function(err, users) {
    if (err) res.send(err);
    res.json(users);
  });
};

// =============================================================================
// =============================================================================
// validate tokens to access any further route below
exports.tokens = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['token'];

  if (token) {
    jwt.verify(token, superSecret, function(err, decoded) {
      if (err)
        res.status(403)
        .send({ success: false, message: 'Invalid token.' });
      else {
        req.decoded = decoded;        //save to request for use in other routes
        next();
      }
    });
  }
  else
    res.status(403)
    .send({ success: false, message: 'Forbidden.' });
};


// =============================================================================
// =============================================================================
// POST api/brothers
exports.create = function(req, res) {
  console.log('req.body', req.body);
  console.log('req.file', req.file);

  // create a new instance and set its data
  var brother         = new Brothers();
  brother.name 		    = req.body.name;
  brother.username    = req.body.username;
  brother.password    = req.body.password;
  brother.roll        = req.body.roll;
  brother.pledgeClass = req.body.pledgeClass;
  brother.major       = req.body.major;
  brother.available   = req.body.available;
  brother.standing    = req.body.standing;
  brother.graduation  = req.body.graduation;
  brother.gpa         = req.body.gpa;

  /* take care of the picture file side of things (more complicated)
  if(req.file) {
    var extension   = req.file.originalname.split(/[. ]+/).pop();
    brother.picture = req.body.roll + '.' + extension;

    // streaming to gridfs
    var writestream = gfs.createWriteStream({ filename: brother.picture });
    fs.createReadStream(req.file.path).pipe(writestream);

    //delete file from temp folder
    writestream.on('close', function (file) {
      fs.unlink(req.file.path, function() {
          // Deleted temp file
        });
    });
  }*/

  // save the new entry
  brother.save(function(err) {
    if (err)
      res.send({ success: false, message: 'Error: ' + err.message });
    else
      res.json({success: true, message: 'User created!', brotherId: brother._id });
  });
};

// =============================================================================
// =============================================================================
// POST /brothers/picture/:brother_id
exports.postPicture = function(req, res) {
  console.log('Posting a picture for ' + req.params.brother_id);
};























// =============================================================================
// =============================================================================
// GET api/brothers/:brother_id
exports.read = function(req, res) {

  // if it is a valid id ...
  if (req.params.brother_id.match(/^[0-9a-fA-F]{24}$/)) {

    // find that brother with the given id
    Brothers.findById(req.params.brother_id, function(err, brother) {
      if (err) res.send(err);

      // return that brother
      res.json(brother);
    });
  }

  // else, it was not a correct mongo id format
  else res.json({ message: 'Invalid id format.' });
};

// =============================================================================
// =============================================================================
// GET api/brothers/picture/:brother_id
exports.readPicture = function(req, res) {


};



// =============================================================================
// PUT api/brothers/:brother_id
exports.update = function(req, res) {

  // if it is a valid id ...
  if (req.params.brother_id.match(/^[0-9a-fA-F]{24}$/)) {

    // find the brother with the given id
    Brothers.findById(req.params.brother_id, function(err, brother) {

      // if there is an error ...
      if (err) res.send(err);

      // set the new brother information if it exists in the request
      if (req.body.username) brother.username       = req.body.username;
      if (req.body.password) brother.password       = req.body.password;
      if (req.body.name) brother.name 				      = req.body.name;
      if (req.body.roll) brother.roll               = req.body.roll;
      if (req.body.pledgeClass) brother.pledgeClass = req.body.pledgeClass;
      if (req.body.major) brother.major             = req.body.major;
      if (req.body.available) brother.available     = req.body.available;
      if (req.body.standing) brother.standing       = req.body.standing;
      if (req.body.graduation) brother.graduation   = req.body.graduation;
      if (req.body.gpa) brother.gpa                 = req.body.gpa;

      // save the newly updated brother
      brother.save(function(err) {
        console.log('Error '  + err);
        if (err) res.send({ message: 'Error: ' + err.message });
        else res.json({ message: 'Brother updated!' });
      });
    });
  }
  // else, it was not a correct mongo id format
  else res.json({ message: 'Invalid id format.' });
};

// =============================================================================
// DELETE api/brothers/:brother_id
exports.delete = function(req, res) {

  // if it is a valid id ...
  if (req.params.brother_id.match(/^[0-9a-fA-F]{24}$/)) {

    Brothers.remove({_id: req.params.brother_id}, function(err, user) {
      if (err) res.send(err);

      // send success message if successfully deleted
      res.json({ message: 'Successfully deleted' });
    });
  }
  // else, it was not a correct mongo id format
  else res.json({ message: 'Invalid id format.' });
};

// =============================================================================
// send the current user
exports.me = function(req, res) {

  // jwt has saved the username in decoded, use this to search as usernames are unique
  // now we can return all the info from the db including _id
  Brothers.findOne({ username: req.decoded.username }).exec(function(err, brother) {
    res.send(brother);
  });
}
