mongoose = require("mongoose");
const { Schema } = mongoose;

const claimNFT = new Schema({
  isMinted: Boolean,
  name: String,
  description: String,
  ipfsUri: String,
  campaign: String,
  owner: String,
  campaignMintNumber: Number,
});

module.exports = mongoose.model("ClaimNFT", claimNFT);
