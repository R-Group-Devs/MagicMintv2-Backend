mongoose = require('mongoose')
const { Schema } = mongoose;


user = new Schema ({
    name: String,
    TwitterId: String,
    CampaignNFTId: String,
    endDate: Date
})


module.exports = mongoose.model('user', user)