// =============================================================================
// get dependencies
var mongoose    = require('mongoose'),
    bodyParser 	= require('body-parser'),
    jwt        	= require('jsonwebtoken'),
    Brothers     = require('../models/api.server.model.js'),
    config      = require('../config/config.js'),
    superSecret = config.secret;

// =============================================================================
// POST api/authenticate
exports.authenticate = function(req, res) {

  // find the user
  Brothers.findOne({ username: req.body.username }).select('name username password').exec(function(err, brother) {

    // throw error
    if (err) throw err;

    // no user with that username was not found, return an error message in json format
    if (!brother) res.status(404).send({ success: false, message: 'Not found.' });

    // otherwise, we have found the user, continue...
    else if (brother) {

      // check if password matches
      var validPassword = brother.comparePassword(req.body.password);

      // if the password is invalid, return an error message in json format...
      if (!validPassword) res.status(401).send({ success: false, message: 'Unauthorized.' });

      // else, the credentials are correct, continue...
      else {

        // create a token
        var token = jwt.sign({
          name: brother.name,
          username: brother.username },
          superSecret,
          { expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information, including token, in json format...
        res.status(200).send({ success: true, message: 'OK.', token: token });
      }
    }
  });
};

// =============================================================================
// validate tokens to access any further route below
exports.tokens = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, superSecret, function(err, decoded) {

      // if invalid token, send error message as json response
      if (err) res.status(403).send({ success: false, message: 'Invalid token.' });

      // else
      else {

        // if everything is good, save to request for use in other routes
        req.decoded = decoded;

        // make sure we go to the next routes and don't stop here
        next();
      }
    });
  }

  // if there is no token, send an error, as a json response...
  else res.status(403).send({ success: false, message: 'Forbidden.' });
};

// =============================================================================
// POST api/brothers
exports.create = function(req, res) {

  // create a new instance and set its data, which comes from the request body
  var brother = new Brothers();
  brother.name 		 = req.body.name;
  brother.username = req.body.username;
  brother.password = req.body.password;

  // save the new entry
  brother.save(function(err) {

    // if there's an error ...
    if (err) {

      // duplicate entry error code
      if (err.code == 11000) return res.json({ success: false, message: 'Username already exists.'});

      // else, return an error message, in json format...
      else
        return res.send(err);
    }

    // return a message
    res.json({ message: 'User created!' });
  });
};

// =============================================================================
// GET api/brothers
exports.brothers = function(req, res) {

  // get all the brothers
  Brothers.find().sort('name').exec(function(err, users) {
    if (err) res.send(err);

    // return the users
    res.json(users);
  });
};

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
// PUT api/brothers/:brother_id
exports.update = function(req, res) {

  // if it is a valid id ...
  if (req.params.brother_id.match(/^[0-9a-fA-F]{24}$/)) {

    // find the brother with the given id
    Brothers.findById(req.params.brother_id, function(err, brother) {

      // if there is an error ...
      if (err) res.send(err);

      // set the new brother information if it exists in the request
      if (req.body.name) brother.name 				= req.body.name;
      if (req.body.username) brother.username = req.body.username;
      if (req.body.password) brother.password = req.body.password;

      // save the newly updated brother
      brother.save(function(err) {
        if (err) res.send(err);

        // return a message
        res.json({ message: 'Brother updated!' });
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
  res.send(req.decoded);
};







/*

/*
  Middleware: find a listing by its ID, then pass it to the next request handler.
  HINT: Find the listing using a mongoose query,
        bind it to the request object as the property 'listing',
        then finally call next

exports.listingByID = function(req, res, next, id) {
  Listing.findById(id).exec(function(err, listing) {
    if(err) {
      res.status(400).send(err);
    } else {
      req.listing = listing;
      next();
    }
  });
};*/
