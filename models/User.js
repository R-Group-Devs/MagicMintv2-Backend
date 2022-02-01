mongoose = require('mongoose')
const { Schema } = mongoose;


user = new Schema ({
    username: String,
    TwitterId: String,
    CampaignId: String,
    profileCreated: Date,
    endDate: Date
})


module.exports = mongoose.model('user', user)