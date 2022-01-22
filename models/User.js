mongoose = require('mongoose')
const { Schema } = mongoose;


user = new Schema ({
    name: String,
    CampaignNFTId: String,
    endDate: Date
})


module.exports = mongoose.model('user', user)