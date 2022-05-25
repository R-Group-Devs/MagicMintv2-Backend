const mongoose = require('mongoose');
const { Schema } = mongoose;

const claimNFT = new Schema({
  isMinted: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  ipfsUri: {
    type: String,
    required: true,
  },
  campaign: {
    type: Schema.Types.ObjectId,
    ref: 'campaign',
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  campaignMintNumber: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('claimNFT', claimNFT);
