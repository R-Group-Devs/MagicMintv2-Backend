mongoose = require("mongoose");
const { Schema } = mongoose;

campaignNFT = new Schema({
  creator: String, // creator twitter handle
  name: String,
  description: String,
  file: String,
  isMinted: Boolean,
});

module.exports = mongoose.model("campaignNFT", campaignNFT);
