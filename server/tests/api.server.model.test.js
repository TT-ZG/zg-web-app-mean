// =============================================================================
// get dependencies
var should   = require('should'),
    mongoose = require('mongoose'),
    Brother  = require('../models/api.server.model'),
    config   = require('../config/config');

var brother, id;

// =============================================================================
// test schema
brother =  {
  name: "Test-Name",
  username: "Test-Username",
  password: "Test-Password"
}

// =============================================================================
// tests for the brothers schema
describe('Brother Schema Unit Tests', function() {

  // connect to the database
  before(function(done) {
    mongoose.connect(config.database);
    done();
  });

  describe('Saving to database', function() {

    // Mocha's default timeout is 2000ms. Increase to ensure no premature timeout.
    this.timeout(10000);

    it('saves properly when username and password provided', function(done){
      new Brother({
        username: brother.username,
        password: brother.password
      }).save(function(err, brother){
        should.not.exist(err);
        id = brother._id;
        done();
      });
    });

    it('saves properly when all properties provided', function(done){
      new Brother(brother).save(function(err, brother){
        should.not.exist(err);
        id = brother._id;
        done();
      });
    });

    it('throws an error when username not provided', function(done){
      new Brother({
        password: brother.password
      }).save(function(err){
        should.exist(err);
        done();
      })
    });

    it('throws an error when password not provided', function(done){
      new Brother({
        username: brother.username
      }).save(function(err){
        should.exist(err);
        done();
      })
    });

  });

  afterEach(function(done) {
    if(id) {
      Brother.remove({ _id: id }).exec(function() {
        id = null;
        done();
      });
    } else {
      done();
    }
  });
});
