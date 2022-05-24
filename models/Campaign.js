const CampaignNFT = require("./CampaignNFT");

mongoose = require("mongoose");
const { Schema } = mongoose;

campaign = new Schema({
  campaignNFTID: {
    // nft id in database
    type: {
      id: Schema.Types.ObjectId,
      ref: "campaignNFT",
    },
    required: true,
  },
  campaignBase: String,
  creator: {
    type: {
      id: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  twitterPostID: {
    type: String,
    required: true,
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
  nftCopies: {
    type: Number,
    required: true,
  },
  collectionAddress: {
    type: String,
    default: "",
    required: true,
  },
  includeLikesBeforeCreation: {
    type: Boolean,
    default: true,
  },
  includeResharesBeforeCreation: {
    type: Boolean,
    default: true,
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
