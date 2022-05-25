let Campaign = require('../models/Campaign');
let CampaignNFT = require('../models/CampaignNFT');
let User = require('../models/User');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const path = require('path');

exports.createCampaign = async (req, res) => {
  const campaign = req.body;
  // filePathNameNew = path.join(__dirname, '../public/assets/upload/NFTPrototype' )
  //create collection
  // one collection per campaign,
  // one collection for all campaigns for a user/dao/entity!
  // deploy a collection, how

  newCampaign = new Campaign({
    campaignNFTID: campaign.campaignNFTID,
    creatorTwitterHandle: campaign.campaignCreator,
    twitterPostID: campaign.twitterPostURL,
    likes: [],
    reshares: [],
    collectionAddress: campaign.collectionAddress,
    nftCopies: campaign.numberOfNFTs,
    includeLikesBeforeCreation: campaign.countOldLikes,
    includeResharesBeforeCreation: campaign.countOldReshares,
    campaignBase: campaign.campaignBase,
    campaignName: campaign.campaignName,
    startDate: Date.now(),
    endDate: campaign.endDate,
  });

  const saved = await newCampaign.save();
  res.send(saved);
};
exports.uploadNFTFile = async (req, res) => {};

exports.createNFT = async (req, res) => {
  if (req.files.file) {
    const fileName = 'nft-upload-' + Math.floor(Math.random() * 100000) + '.' + req.files.file.name.split('.').pop();
    const filePathNameNew = path.join(__dirname, '../public/assets/upload/NFTPrototype' + fileName);

    const userCreate = await User.findOne({}).where('username').equals(req.body.creator);

    console.log('test', userCreate);
    campaignNFT = new CampaignNFT({
      creator: userCreate._id, // creator twitter handle
      name: req.body.name,
      description: req.body.description,
      file: fileName,
    });
    await req.files.file.mv(filePathNameNew);

    const saved = await campaignNFT.save();

    if (saved) {
      res.send('OK');
    }
  }
};

exports.getNFTPrototypeCreatedByUser = async (req, res) => {
  const NFTPrototypes = await CampaignNFT.find({ creator: req.user._id });

  if (NFTPrototypes) {
    res.send(NFTPrototypes);
  } else {
    res.send('Not able to fetch or there are not any');
  }
};

exports.getCampaignById = async (req, res) => {};
exports.deleteCampaign = async (req, res) => {};
exports.archieveCampaign = async (req, res) => {};

exports.getAllCampaignsByUser = async (req, res) => {
  const campaigns = await Campaign.find({
    creatorTwitterHandle: req.params.handle,
  });

  if (campaigns) {
    res.send(campaigns);
  } else {
    res.send('error finding campaigns');
  }
};
exports.getAllCampaigns = async (req, res) => {
  const campaigns = await Campaign.find();

  if (campaigns) {
    res.send(campaigns);
  } else {
    res.send('error finding campaigns');
  }
};
