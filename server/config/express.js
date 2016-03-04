// =============================================================================
// =============================================================================
// get dependencies
var express    = require('express'),
    config     = require('./config'),
    bodyParser = require('body-parser'),
    morgan     = require('morgan'),
    mongoose   = require('mongoose'),
    path 	   	 = require('path'),
    apiRouter  = require('../routes/api.server.routes'),
    Grid       = require('gridfs-stream');

// =============================================================================
// =============================================================================
// export a function that sets up everything for this app
module.exports.init = function() {


  //initialize app
  var app = express();

  // lets us get info from post requests
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // lets us handle CORS requests (cross-domain)
  app.use(function(req, res, next) {
  	res.setHeader('Access-Control-Allow-Origin', '*');
  	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  	next();
  });

  // log all requests
  app.use(morgan('dev'));

  /* serve static files */
  app.use('/', express.static(__dirname + '/../../client'));
  app.use('/public', express.static(__dirname + '/../../public'));

  /* use the api router for requests to the api*/
  app.use('/api', apiRouter);

  /* go to homepage for all routes not specified */
  app.all('/*', function(req, res) {
    res.sendFile(path.resolve('client/index.html'));
  });

  return app;
};
