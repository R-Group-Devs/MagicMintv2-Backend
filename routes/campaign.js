var express = require("express");
let router = express.Router();
let campaignController = require("../controllers/campaignController");

router.get("/campaign/allcampaigns", campaignController.getAllCampaigns);

router.get(
  "/campaign/allcampaigns/twitterpostid",
  campaignController.getAllCampaigns
);

router.get("/campaign/all/:handle", campaignController.getAllCampaignsByUser);

router.get("/campaign/:id", campaignController.getCampaignById);

router.get(
  "/campaign/getNFTPrototype/:handle",
  campaignController.getNFTPrototypeCreatedByUser
);

router.post("/campaign/create", campaignController.createCampaign);

router.post("/campaign/createNFT", campaignController.createNFT);

router.post("/campaign/archive", campaignController.archieveCampaign);

router.post("/campaign/delete", campaignController.deleteCampaign);

module.exports = router;
