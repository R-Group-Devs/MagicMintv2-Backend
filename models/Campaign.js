const CampaignNFT = require('./CampaignNFT');

mongoose = require('mongoose')
const { Schema } = mongoose;


campaign = new Schema ({
    name: String,
    TwitterPostID: String,
    endDate: Date,
})


module.exports = mongoose.model('campaign', campaign)