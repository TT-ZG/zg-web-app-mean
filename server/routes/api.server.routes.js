// =============================================================================
// get dependencies
var api = require('../controllers/api.server.controller.js'),
    express = require('express'),
    router = express.Router();

// =============================================================================




// setup correct routes
router.route('/brothers')
  .get(api.brothers);

router.route('/authenticate')
  .post(api.authenticate);

// validate token before allowing access to the following routes
router.use(api.tokens);

router.route('/brothers')
  .post(api.create);

router.route('/brothers/:brother_id')
  .get(api.read)
  .put(api.update)
  .delete(api.delete);

router.route('/me')
  .get(api.me);

// =============================================================================
// export the router
module.exports = router;


/*
  The 'router.param' method allows us to specify middleware we would like to use to handle
  requests with a parameter.
  Say we make an example request to '/listings/566372f4d11de3498e2941c9'
  The request handler will first find the specific listing using this 'listingsById'
  middleware function by doing a lookup to ID '566372f4d11de3498e2941c9' in the Mongo database,
  and bind this listing to the request object.
  It will then pass control to the routing function specified above, where it will either
  get, update, or delete that specific listing (depending on the HTTP verb specified)
router.param('listingId', listings.listingByID);*/
