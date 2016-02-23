// =============================================================================
// get dependencies
var config   = require('./config'),
    mongoose = require('mongoose'),
    express  = require('./express');

// =============================================================================
// export a function that starts the server
module.exports.start = function() {

  // setup all dependencies and routing
  var app = express.init();

  // begin listening on the specified port
  app.listen(config.port, function() {
    console.log('App listening on port', config.port);
  });
};
