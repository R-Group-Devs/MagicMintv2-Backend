const CampaignNFT = require("./CampaignNFT");

mongoose = require("mongoose");
const { Schema } = mongoose;

campaign = new Schema({
  campaignNFTID: {
    // nft id in database
    type: String,
    default: "",
  },
  campaignBase: String,
  creatorTwitterHandle: {
    type: String,
    default: "",
  },
  twitterPostID: {
    type: String,
    default: "",
  },
  likes: {
    // array of handles that liked
    type: Array,
    default: [],
  },
  reshares: {
    // array of handles that reshared
    type: Array,
    default: [],
  },
  countOldLikes: {
    type: Number,
    default: 0,
  },
  countOldReshares: {
    type: Number,
    default: 0,
  },
  nftCopies: {
    type: Number,
    default: 0,
  },
  collectionAddress: {
    type: String,
    default: "",
  },
  includeLikesBeforeCreation: {
    type: Boolean,
    default: false,
  },
  includeResharesBeforeCreation: {
    type: Boolean,
    default: false,
  },
  campaignName: {
    type: String,
    default: "",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: Date,
});

module.exports = mongoose.model("campaign", campaign);
