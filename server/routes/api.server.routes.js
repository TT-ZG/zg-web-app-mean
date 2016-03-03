// =============================================================================
// get dependencies
var api = require('../controllers/api.server.controller.js'),
    express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    upload = multer({ dest: 'uploads/'});
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

  router.route('/brothers/picture/:brother_id')
    .post(upload.single('file'), api.postPicture)
    .get(api.readPicture);


router.route('/me')
  .get(api.me);

// =============================================================================
// export the router
module.exports = router;
