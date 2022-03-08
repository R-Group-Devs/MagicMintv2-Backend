mongoose = require('mongoose')
const { Schema } = mongoose;


user = new Schema ({
    username: String,
    TwitterId: String,
    CampaignId: String,
    createdNFT: { // the ID of the createdNFTs
        type: Array,
        default: []
    },
    profileCreated: Date,
    endDate: Date
})


module.exports = mongoose.model('user', user)