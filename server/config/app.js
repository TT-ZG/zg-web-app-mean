// =============================================================================
// get dependencies
var config   = require('./config'),
    mongoose = require('mongoose'),
    express  = require('./express'),
    Grid     = require('gridfs-stream');

// =============================================================================
// export a function that starts the server
module.exports.start = function() {

  // connect to the database
  mongoose.connect(config.database);

  /*set up GridFS
  var conn = mongoose.connection;
  Grid.mongo = mongoose.mongo;
  conn.once('open', function() {
    console.log('Database and GridFS connected');
    //var gfs = Grid(conn.db);
    //app.set('gridfs', gfs);
  });*/

  // setup all dependencies and routing
  var app = express.init();

  // begin listening on the specified port
  app.listen(config.port, function() {
    console.log('App listening on port', config.port);
  });
};
