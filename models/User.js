const mongoose = require('mongoose');
const { Schema } = mongoose;

user = new Schema({
  username: String,
  TwitterId: String,
  CampaignId: String,
  createdNFT: {
    // the ID of the createdNFTs
    type: Array,
    default: [],
  },
  twitterPhoto: String,
  profileCreated: Date, // {type: Date, default: Date.now()}
  endDate: Date,
});

module.exports = mongoose.model('user', user);
