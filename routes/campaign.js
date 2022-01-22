var express = require('express');
let router = express.Router();

let campaignController =  require("../controllers/campaignController")




router.get('/campaign/all', campaignController.getAllCampaigns);

router.get('/campaign/:id', campaignController.getCampaignById)

router.post('/campaign/create', campaignController.createCampaign)

router.post('/campaign/archive', campaignController.archieveCampaign)

router.post('/campaign/delete', campaignController.deleteCampaign)


module.exports = router;