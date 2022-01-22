mongoose = require('mongoose')
const { Schema } = mongoose;


campaignNFT = new Schema ({
    CampaignID: String,
    IPFSUri: String,
    isMinted: Boolean
})


module.exports = mongoose.model('campaignNFT', campaignNFT)