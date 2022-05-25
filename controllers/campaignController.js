let Campaign = require('../models/Campaign');
let CampaignNFT = require('../models/CampaignNFT');
let User = require('../models/User');
const { ObjectId } = require('mongodb');
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

  const newCampaign = new Campaign({
    campaignNFTID: campaign.campaignNFTID,
    creator: req.user._id,
    twitterPostID: campaign.twitterPostID,
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
  res.status(200).json(saved);
};

exports.uploadNFTFile = async (req, res) => {};

exports.createNFT = async (req, res) => {
  if (req.files?.file) {
    const fileName = 'nft-upload-' + Date.now() + '.' + req.files.file.name.split('.').pop();
    const filePathNameNew = path.join(__dirname, '../public/assets/upload/NFTPrototype' + fileName);

    const campaignNFT = new CampaignNFT({
      creator: req.user._id,
      name: req.body.name,
      description: req.body.description,
      fileSrc: fileName,
    });

    try {
      await req.files.file.mv(filePathNameNew);
    } catch (error) {
      res.status(500).json(error);
    }

    const saved = await campaignNFT.save();

    res.status(200).json(saved);
  }
};

exports.getNFTPrototypeCreatedByUser = async (req, res) => {
  const NFTPrototypes = await CampaignNFT.find({ creator: req.user._id });

  res.status(200).json(NFTPrototypes);
};

exports.getCampaignById = async (req, res) => {};
exports.deleteCampaign = async (req, res) => {};
exports.archieveCampaign = async (req, res) => {};

//first finish createCampaign and then this
exports.getAllMyCampaigns = async (req, res) => {
  const campaigns = await Campaign.find({
    creator: req.user._id,
  });

  res.status(200).json(campaigns);
};

exports.getAllCampaigns = async (req, res) => {
  const campaigns = await Campaign.find({});

  res.status(200).json(campaigns);
};
