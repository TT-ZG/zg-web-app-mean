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
// GET api/brothers
exports.brothers = function(req, res) {
  Brothers.find()
  .sort('name')
  .exec(function(err, brothers) {
    if (err){
      res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
    }
    else {
      res.status(200).send({ success: true, message: '200 - OK: Successfully retrieved brothers.', info: brothers });
    }
  });
};

// =============================================================================
// =============================================================================
// Users post to api/authenticate to get a token
exports.authenticate = function(req, res) {

  // find by username as these are unique
  Brothers.findOne({ username: req.body.username })
  .select('name username password')
  .exec(function(err, brother) {
    // throw error if any
    if (err){
      res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
    }

    // if not found, return false
    if (!brother)
      res.status(401).send({ success: false, message: '401 - Unauthorized: User/password incorrect.' });

    else if (brother) {
      // check passwords
      var validPassword = brother.comparePassword(req.body.password);
      if (!validPassword)
        res.status(401).send({ success: false, message: '401 - Unauthorized: User/password incorrect.' });

      // sign a token if all is OK
      else {
        console.log('Signing a token');
        var token = jwt.sign({
          name: brother.name,
          username: brother.username },
          superSecret,
          {expiresInMinutes: 1440});
        res.status(200).send({ success: true,  message: '200 - OK: Successfully created token.', token: token });
      }
    }
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
        res.status(403).send({ success: false, message: '403 - Forbidden: Invalid token.' });
      else {
        req.decoded = decoded;        //save to request for use in other routes
        next();
      }
    });
  }
  else {
    res.status(403).send({ success: false, message: '403 - Forbidden: No token.' });
  }
};

// =============================================================================
// =============================================================================
// send the current user
exports.me = function(req, res) {
  Brothers.findOne({ username: req.decoded.username })
  .exec(function(err, brother) {
    if (err){
      res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
    }
    else {
      res.status(200).send({ success: true, message: '200 - OK: Successfully retrieved logged in user.', info: brother });
    }
  });
}

// =============================================================================
// =============================================================================
// DELETE api/brothers/:brother_id
exports.delete = function(req, res) {

  // if it is a valid id ...
  if (req.params.brother_id.match(/^[0-9a-fA-F]{24}$/)) {

    Brothers.remove({_id: req.params.brother_id}, function(err, user) {
      if (err) {
        res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
      }
      else {
        res.status(200).send({ success: true, message: '200 - OK: Successfully deleted brother info.' });
      }
    });
  }
  // else, it was not a correct mongo id format
  else {
    res.status(400).send({ success: false, message: '400 - Bad Request: Id is incorrect format.' });
  }
};
// =============================================================================
// =============================================================================
// DELETE api/pictures/:id
exports.deletePicture = function(req, res) {

  if (req.params.id === '0.jpg'){
    res.status(202).send({ success: true, message: '202 - Accepted: Received request but did not delete default picture.' });
  }
  else {
    gfs.remove({filename: req.params.id}, function (err) {
      if (err) {
        res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
      } else {
        res.status(200).send({ success: true, message: '200 - OK: Successfully deleted brother picture.' });
      }
    });
  }
};

// =============================================================================
// =============================================================================
// Create a brother and upload their JSON data
// POST api/brothers
exports.create = function(req, res) {

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
  brother.internships = req.body.internships;

  // save the new entry
  brother.save(function(err) {
    if (err) {
      if (err.code === 11000) {
        res.status(300).send({ success: false, message: '400 - Bad Request: Duplicate Roll/Username' });
      }
      else {
          res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
      }
    }
    else {
      res.status(200).send({ success: true, message: '200 - OK: Brother created!', brotherId: brother._id });
    }
  });
};

// =============================================================================
// =============================================================================
// Post a picture of a brother given their unique mongo _id
// POST /api/pictures/:id
exports.postPicture = function(req, res) {
  // if it is a valid id ...
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    if (req.file){
      // find the brother given the id

      console.log ('id and picture here');

      Brothers.findById(req.params.id, function(err, brother) {
        if (err) {
          res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
        }

        // get the extension
        var extension   = req.file.originalname.split(/[. ]+/).pop();
        brother.picture = brother.roll + '.' + extension;

        // streaming to gridfs
        var writestream = gfs.createWriteStream({ filename: brother.picture });
        fs.createReadStream(req.file.path).pipe(writestream);

        //delete file from temp folder
        writestream.on('close', function (file) {
          fs.unlink(req.file.path, function() {
              console.log('Temporary file has been deleted.');
            });
        });

        // save the brothers information
        brother.save(function(err) {
          if (err){
            if (err.code === 11000){
              res.status(500).send({ success: false, message: '500 - Internal Server Error: Duplicate Picture' });
            }
            else {
                res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
            }
          }
          else {
            res.status(200).send({ success: true, message: '200 - OK: Custom brother picture uploaded.' });
          }
        });
      });
    }
    else {
        res.status(200).send({ success: true, message: '200 - OK: No custom picture uploaded.'});
      }
  }
  else {
    res.status(400).send({ success: false, message: '400 - Bad Request: Id is incorrect format.' });
  }
};

// =============================================================================
// =============================================================================
// Retrieve a brother by their id
// GET api/brothers/:brother_id
exports.read = function(req, res) {

  // if it is a valid id ...
  if (req.params.brother_id.match(/^[0-9a-fA-F]{24}$/)) {

    // find that brother with the given id
    Brothers.findById(req.params.brother_id, function(err, brother) {
      if (err){
        res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
      }
      else {
        res.status(200).send({ success: true,  message: '200 - OK: Successfully retrieved brother info.', info: brother });
      }
    });
  }

  // else, it was not a correct mongo id format
  else {
    res.status(400).send({ success: false, message: '400 - Bad Request: Invalid id format' });
  }
};


// =============================================================================
// =============================================================================
// Get a picture given a pictures name
// GET api/pictures/:id
exports.readPicture = function(req, res) {

  // find the picture
  gfs.files.find({ filename: req.params.id }).toArray(function (err, files) {
    console.log(files);

 	  if(files.length===0)
      return res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });

    // create a read stream
    var readstream = gfs.createReadStream({
     	filename: files[0].filename
     });

     // Return the binary data as base64 encoded data
     var bufs = [];
     readstream.on('data', function(chunk) {
       bufs.push(chunk);}
     )
     .on('error', function (err) {
       return res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
     })
     .on('end', function() { // done
       var fbuf = Buffer.concat(bufs);
       var base64 = (fbuf.toString('base64'));
       res.status(200).send({ success: true, message: '200 - OK: Img binary->base64 conversion successful.', data: base64});
    });
  });
};


// =============================================================================
// =============================================================================
// PUT api/brothers/:brother_id
exports.update = function(req, res) {

  // if it is a valid id ...
  if (req.params.brother_id.match(/^[0-9a-fA-F]{24}$/)) {

    // find the brother with the given id
    Brothers.findById(req.params.brother_id, function(err, brother) {

      // if there is an error ...
      if (err) {
        res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
      }

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
      if (req.body.picture) brother.picture         = req.body.picture;
      if (req.body.internships) brother.internships = req.body.internships;

      // save the newly updated brother
      brother.save(function(err) {
        if (err){
          if (err.code === 11000){
            res.status(500).send({ success: false, message: '500 - Internal Server Error: Duplicate Roll/Username' });
          }
          else {
            res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
          }
        }
        else {
          res.status(200).send({ success: true, message: '200 - OK: Brother updated!' });
        }
      });
    });
  }
  // else, it was not a correct mongo id format
  else {
    res.status(400).send({ success: false, message: '400 - Bad Request: Invalid id format' });
  }
};

// =============================================================================
// =============================================================================
// PUT api/pictures/:id
exports.updatePicture = function(req, res) {
  // if it is a valid id ...
  if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {

    // If there's a file attached, then we are uploading a new picture
    if (req.file){
      // find the brother given the id
      Brothers.findById(req.params.id, function(err, brother) {

        if (err) {
          res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
        }

        // Delete the brothers current picture from mongo, unless it is 0.jpg
        if (brother.picture != '0.jpg'){

          // verify it exists and not some mishap
          var options = {filename : brother.picture}; //can be done via _id as well
          gfs.exist(options, function (err, found) {

            if (err){
              res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
            }

            if (found){
              gfs.remove({filename: brother.picture}, function (err) {
                if (err) {
                  res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
                }
              });
            }
          });
        }

        // get the extension
        var extension   = req.file.originalname.split(/[. ]+/).pop();
        brother.picture = brother.roll + '.' + extension;

        // streaming to gridfs
        var writestream = gfs.createWriteStream({ filename: brother.picture });
        fs.createReadStream(req.file.path).pipe(writestream);

        //delete file from temp folder
        writestream.on('close', function (file) {
          fs.unlink(req.file.path, function() {
            console.log('Temporary file has been deleted.');
          });
        });

        // save the brothers information
        brother.save(function(err) {
          if (err){
            if (err.code === 11000){
              res.status(500).send({ success: false, message: '500 - Internal Server Error: Duplicate Picture' });
            }
            else {
              res.status(500).send({ success: false, message: '500 - Internal Server Error: ' + err });
            }
          }
          else {
            res.status(200).send({ success: true, message: '200 - OK: Custom brother picture updated.' });
          }
        });
      });
    }
    else {
        res.status(200).send({ success: false, message: '200 - OK: No custom picture updated.'});
      }
  }
  else {
    res.status(400).send({ success: false, message: '400 - Bad Request: Id is incorrect format.' });
  }
};
