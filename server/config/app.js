// =============================================================================
// get dependencies
var config   = require('./config'),
    mongoose = require('mongoose'),
    express  = require('./express'),
    Grid     = require('gridfs-stream');

// =============================================================================
// export a function that starts the server
module.exports.start = function() {

  // setup all dependencies and routing
  var app = express.init();

  mongoose.connect(config.database);
  var conn = mongoose.connection;
  Grid.mongo = mongoose.mongo;
  conn.once('open', function() {
    console.log('open sesame');
    var gfs = Grid(conn.db);
    app.set('gridfs', gfs);
  });

  // begin listening on the specified port
  app.listen(config.port, function() {
    console.log('App listening on port', config.port);
  });
};
