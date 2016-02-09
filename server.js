// =============================================================================
// SETUP
// =============================================================================

// ------------------------------------
// GET DEPENDENCIES
// ------------------------------------
var express    = require('express'),     //lets us use an easier node framework
    app        = express(),              //Initialize our app to be an express app
    bodyParser = require('body-parser'), //lets us to get POST content from req
    morgan     = require('morgan'),      //lets us log reqs to console
    mongoose   = require('mongoose'),    //lets us use an easier mongo framework
    config     = require('./config'),    //get the apps sensitive information
    path       = require('path');        //lets us easily set relative paths

// ------------------------------------
// APP CONFIGURATION
// ------------------------------------
// lets us get the content within a POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS errors, handle and allow requests from any domain
app.use(function(req, res, next){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers',
               'X-Requested-With, content-type, Authorization');
      next();
})

//log all requests to the console and connect to the database
app.use(morgan('dev'));
mongoose.connect(config.database);


// =============================================================================
// API ROUTES
// =============================================================================

//Setup api, pass the secret signature held by the server to verify tokens
var apiRoutes = require('./app/routes/api')(app, express, config.secret);
app.use('/api', apiRoutes);


// =============================================================================
// FRONTEND ROUTES
// =============================================================================

// main catchall route, sends client to home.
// remember, with middleware, order matters. this comes AFTER the api routes.
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


// =============================================================================
// START THE SERVER
// =============================================================================

app.listen(config.port);
console.log('App listening on port ' + config.port);
