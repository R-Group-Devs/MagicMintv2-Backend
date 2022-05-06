let Campaign = require("../models/Campaign");
let CampaignNFT = require("../models/CampaignNFT");
let User = require("../models/User");
const ClaimNFT = require("../models/ClaimNFT");
const fs = require("fs");
const path = require("path");
const axios = require("axios").default;
// const ipfsAPI = require('ipfs-http-client');
const { create } = require("ipfs-http-client");
const ipfs = create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

// const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

exports.getAllClaimsByUser = async (req, res) => {
  let campaignIDs = await Campaign.find({});

  let claims = null;
  let newNFTs = [];
  let ipfsData;

  campaignIDs = campaignIDs.map((campaign) => campaign.twitterPostID);

  //stop
  const config = {
    headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
  };

  campaignIDs.forEach(async (campaignID) => {
    const campaignData = await axios.get(
      `https://api.twitter.com/2/tweets/${campaignID}/retweeted_by`,
      config
    );
    //needs future optimization
    // it creates requests to twitter to fetch the users that retweeted for every campaign in the database

    if (campaignData.data.meta.result_count == 0) {
      res.send("No one has reshared");
      console.log("no one has reshared");
    } else {
      let reshares = campaignData.data.data;

      reshares.forEach(async (reshare, index) => {
        if (reshare.username == req.params.user) {
          let specificCampaign = await Campaign.findOne({})
            .where("twitterPostID")
            .equals(campaignID);

          let specificNFTMetadata = await CampaignNFT.find({})
            .where("file")
            .equals(specificCampaign.campaignNFTID);

          fs.readFile(
            path.join(
              __dirname,
              `../public/assets/upload/NFTPrototype${specificCampaign.campaignNFTID}`
            ),
            async (err, data) => {
              if (err) {
                throw err;
              } else {
                if (specificNFTMetadata) {
                  let hm = true;

                  claims = await ClaimNFT.find({})
                    .where("owner")
                    .equals(req.params.user);

                  claims.forEach(async (claim) => {
                    if (
                      claim.name == specificNFTMetadata[0].name &&
                      specificCampaign.campaignName == claim.campaign
                    ) {
                      hm = false;
                    }
                  });
                  if (hm) {
                    ipfsData = await ipfs.add(data);

                    const claimNFT = new ClaimNFT({
                      isMinted: false,
                      name: specificNFTMetadata[0].name,
                      description: specificNFTMetadata[0].description,
                      ipfsUri: ipfsData.path,
                      campaign: specificCampaign.campaignName,
                      owner: req.params.user,
                      campaignMintNumber: 0,
                    });

                    const saved = await claimNFT.save();
                    newNFTs.push(saved);
                  }
                }
              }
            }
          );
        }
      });
    }
  });

  if (newNFTs.length > 0) {
    console.log(claims, "claims");
    res.send(newNFTs);
  } else {
    res.send("none");
  }
};

exports.getClaims = async (req, res) => {
  let claims = await ClaimNFT.find({})
    .where("owner")
    .equals(req.params.user)
    .where("isMinted")
    .equals(false);
  res.send(claims);
};

exports.getClaimedNFTs = async (req, res) => {
  let claims = await ClaimNFT.find({})
    .where("owner")
    .equals(req.params.user)
    .where("isMinted")
    .equals(true);
  res.send(claims);
};

exports.claimSingleNFT = async (req, res) => {
  const _id = req.params._id;

  updateNFT = await ClaimNFT.findOne({}).where("_id").equals(_id);

  updateNFT.isMinted = true;

  const updated = await updateNFT.save();

  if (updated) {
    res.send(updated);
  } else {
    res.send("error");
  }
};
