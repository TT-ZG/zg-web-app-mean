// =============================================================================
// =============================================================================
// get dependencies
var api     = require('../controllers/api.server.controller.js'),
    express = require('express'),
    router  = express.Router(),
    multer  = require('multer'),
    upload  = multer({ dest: 'uploads/'});

// =============================================================================
// =============================================================================
// Retrieving all brothers is allowed to the public
router.route('/brothers')
  .get(api.brothers);

// Attempting to login is allowed to the public
router.route('/authenticate')
  .post(api.authenticate);

// Retrieving a single brother is allowed to the public
router.route('/brothers/:brother_id')
  .get(api.read);

// Retrieving a single brother's picture is allowed to the public
router.route('/pictures/:id')
  .get(api.readPicture);

// To use any of the following routes, a token is required
router.use(api.tokens);

// Posting to create a brother
router.route('/brothers')
  .post(api.create);

// Editing and deleting a brother
router.route('/brothers/:brother_id')
  .put(api.update)
  .delete(api.delete);

// Editing, deleting, and posting pictures
router.route('/pictures/:id')
  .delete(api.deletePicture)
  .post(upload.single('file'), api.postPicture)
  .put(upload.single('file'), api.updatePicture);

// Getting the current user
router.route('/me')
  .get(api.me);

// =============================================================================
// =============================================================================
// export the router
module.exports = router;
