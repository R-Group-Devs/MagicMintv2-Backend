mongoose = require("mongoose");
const { Schema } = mongoose;

const campaignNFT = new Schema({
  creator: {
    type: {
      id: Schema.Types.ObjectId,
      ref: "user",
    },
    required: true,
  },
  name: {
    required: true,
    trim: true,
    type: String,
  },
  description: {
    required: true,
    trim: true,
    type: String,
  },
  file: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("campaignNFT", campaignNFT);
