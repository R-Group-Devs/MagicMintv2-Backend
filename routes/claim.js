var express = require('express');
let router = express.Router();
let claimController =  require("../controllers/claimController")


router.get('/claim/getAllClaimsByUser/:user', claimController.getAllClaimsByUser);

router.get('/claim/getClaims/:user', claimController.getClaims);

router.get('/claim/getClaimedNFTs/:user', claimController.getClaimedNFTs);

router.get('/claim/claimSingleNFT/:_id', claimController.claimSingleNFT);






module.exports = router;    