let express = require('express');
let router = express.Router();

let oauthController =  require("../controllers/oauthController")


router.post('/twitter/oauth/request_token', oauthController.requestToken);

router.post('/twitter/oauth/access_token', oauthController.accessToken);

router.get('/twitter/oauth/profile_access', oauthController.profileAccess);

router.post('/twitter/oauth/logout', oauthController.logout);

module.exports = router;