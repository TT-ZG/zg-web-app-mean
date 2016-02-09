// =============================================================================
// BASE SETUP
// =============================================================================

// --------------------------------------------
// CALL THE PACKAGES
// --------------------------------------------
var express    = require('express'),          //call express
    app        = express(),                   //define our app using express
    bodyParser = require('body-parser'),      //let us get POST content from req
    morgan     = require('morgan'),           //lets us log reqs to console
    mongoose   = require('mongoose'),         //mongo framework
    port       = process.env.PORT || 8080,    //set port for app
    User       = require('./app/models/user') //get the user schema
    config     = require('./config');         //get the mongolabs URI

/* Connect to your database */
mongoose.connect(config.db.uri);
// --------------------------------------------
// APP CONFIGURATION
// --------------------------------------------
// use body parser so we can grab information from POST reqs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle and allow requests from any domain
// prevents CORS errors
app.use(function(req, res, next){
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
      res.setHeader('Access-Control-Allow-Headers',
                   'X-Requested-With, content-type, Authorization');
      next();
})

// log all requests to the console
app.use(morgan('dev'));

// connect to our database
mongoose.connect(config.db.uri);



// =============================================================================
// ROUTES FOR OUR API
// =============================================================================

// basic route for the home page
app.get('/', function(req, res) {
      res.send('Welcome to the home page!');
});

// get an instance of the express router
var apiRouter = express.Router();

// middleware that will log all requests
apiRouter.use(function(req, res, next) {
      console.log('Somebody just came to our app!');
      // go to the next route in line
      next();
})


// --------------------------------------------
// ROUTES THAT END IN /users
// --------------------------------------------
apiRouter.route('/users')

      // create a user (accessed at POST http://localhost:8080/api/users)
      .post(function(req,res) {

            // create a new instance of the User model
            var user = new User();

            // set the users information (comes from the request)
            user.name     = req.body.name;
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

      // get all the users (accessed at GET http://localhost:8080/api/users)
      .get(function(req, res) {

            User.find(function(err, users) {
                  if (err) res.send(err);

                  // return the users
                  res.json(users);
            });
        });

// --------------------------------------------
// ROUTES THAT END IN /users/:user_id
// --------------------------------------------
apiRouter.route('/users/:user_id')

      // get the user with that id
      //(accessed at GET http://localhost:8080/api/users/:user_id)
      .get(function (req, res) {
            User.findById(req.params.user_id, function(err, user) {
                  if (err) res.send(err);

                  // return the user
                  res.json(user);
            });
        })

        // update the user with this id
        //(accessed at PUT http://localhost:8080/api/users/:user_id)
        .put(function(req, res) {

              // use our user model to find the user we want
              User.findById(req.params.user_id, function(err, user) {
                    if (err) res.send(err);

                    // update the users info only if its new
                    if (req.body.name) user.name         = req.body.name;
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

        //delete the user with this id
        //(accessed at DELETE http://localhost:8080/api/users/:user_id)
        .delete(function(req, res) {
              User.remove({_id: req.params.user_id}, function(err, user) {
                    if (err) return res.send(err);

                    res.json({ message: 'Successfully deleted' });

              });
        });




// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res){
  res.json( { message : 'hooray!, welcome to our api!' });
});

//more routes for our API will happen here



// --------------------------------------------
// REGISTER OUR ROUTES
// --------------------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);


// =============================================================================
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
