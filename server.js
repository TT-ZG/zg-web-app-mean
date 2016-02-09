// =============================================================================
// BASE SETUP
// =============================================================================

// --------------------------------------------
// CALL THE PACKAGES
// --------------------------------------------
var express    = require('express'),            //call express
    app        = express(),                     //define our app using express
    bodyParser = require('body-parser'),        //get POST content from req
    morgan     = require('morgan'),             //lets us log reqs to console
    mongoose   = require('mongoose'),           //mongo framework
    config     = require('./config'),           //get the mongolabs URI
    path       = require('path');             //helps us with getting paths

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

//log all requests to the console, connect to our database
app.use(morgan('dev'));
mongoose.connect(config.database);


// =============================================================================
// API ROUTES
// =============================================================================
var apiRoutes = require('./app/routes/api')(app, express, config.secret);
app.use('/api', apiRoutes);


// =============================================================================
// SEND USERS TO FRONTEND
// =============================================================================
// main catchall route, MUST be registered after API ROUTES
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


// =============================================================================
// START THE SERVER
// =============================================================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
