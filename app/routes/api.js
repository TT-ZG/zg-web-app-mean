// =============================================================================
// SETUP
// =============================================================================

// ------------------------------------
// GET DEPENDENCIES
// ------------------------------------
var User = require('../models/user'),
    jwt  = require('jsonwebtoken');


// =============================================================================
// EXPORT THE API
// =============================================================================

module.exports = function(app, express, superSecret){

  // make an instance of the express router
  var apiRouter = express.Router();

  // ------------------------------------
  // POST host/api/authenticate
  // ------------------------------------
  // route to authenticate a user
  apiRouter.post('/authenticate', function(req, res) {

    // find the users
    // select the name, username and password explicitly
    User.findOne({username: req.body.username})
    .select('name username password')
    .exec(function(err, user) {

      if (err) throw err;

      // no user with the username was found
      if (!user) {
        res.json({success: false, message: 'Failed. User not found.'});
      }

      else if (user) {

        // compare the submitted password to that users hashed password
        var validPassword = user.comparePassword(req.body.password);

        //if the password is invalid
        if(!validPassword){
          res.json({success: false, message: 'Failed. Wrong password.'});
        }
        else {
          // if user is found and password is right, create a token
          var token = jwt.sign({name: user.name, username: user.username},
                               superSecret, {expiresInMinutes: 1440});

          // return the information including token as json
          res.json({success: true, message: 'Enjoy your token!', token: token});
        }
      }
    });
  });

  // ------------------------------------
  // VALIDATE REQUEST TO host/api/*
  // ------------------------------------
  // route middleware to verify a token
  apiRouter.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies token, returns tokens user as decoded JSON object
      jwt.verify(token, superSecret, function(err, decoded) {

        if(err){
          return res.status(403).send({ success: false, message: 'Invalid token.'});
        }
        else {
          // if good, save to request for use in other routes, continue
          req.decoded = decoded;
          next();
        }
      });
    }
    else {
      // if there is no token provided
      return res.status(403).send({success: false, message: 'No token provided.'});
    }
  });

  // ------------------------------------
  // GET host/api/
  // ------------------------------------
  // welcome message
  apiRouter.get('/', function(req, res){
        res.json( { message : 'Token accepted. Welcome to the API.' });
  });


  // --------------------------------------------
  // ROUTES WITH ENDPOINT api/users
  // --------------------------------------------
  apiRouter.route('/users')

    // POST host/api/users
    .post(function(req,res) {

      // create a new instance of the User model
      var user = new User();

      // set the users information (comes from the request)
          user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;

      // save the user and check for errors
      user.save(function(err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000)
            return res.json({success: false, message: 'Username already exists.'});
          else
            return res.send(err);
        }

        res.json({ message: 'User created!' });
      });
    })

    // GET host/api/users)
    .get(function(req, res) {

      User.find(function(err, users) {
        if (err) res.send(err);

        // return the users
        res.json(users);
      });
    });


  // --------------------------------------------
  // ROUTES WITH ENDPOINT api/users/:user_id
  // --------------------------------------------
  apiRouter.route('/users/:user_id')

    // get the user with that id
    //GET host/api/users/:user_id
    .get(function (req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        // return the user
        res.json(user);
      });
     })

    // PUT host/api/users/:user_id
    .put(function(req, res) {

      // use our user model to find the user we want
      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        // update the users info only if its new
        if (req.body.name)        user.name  = req.body.name;
        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;

        // save the user
        user.save(function(err) {
          if (err) res.send(err);

          // return a message
          res.json({ message: 'User updated!' });
        });
      });
    })

    //DELETE host/api/users/:user_id)
    .delete(function(req, res) {
      User.remove({_id: req.params.user_id}, function(err, user) {
        if (err) return res.send(err);

        res.json({ message: 'Successfully deleted' });

      });
    });

  // --------------------------------------------
  // ROUTES WITH ENDPOINT api/me
  // --------------------------------------------
  // api endpoint to get user information
  // recall we store the logged in user in req.decoded in app.use(...)
  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });

  // --------------------------------------------
  // return the router
  // --------------------------------------------
  return apiRouter;
  };
