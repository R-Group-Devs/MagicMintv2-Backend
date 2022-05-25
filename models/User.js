const mongoose = require("mongoose");
const { Schema } = mongoose;

const user = new Schema({
  createdNFT: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "campaignNFT",
    },
  ],
  twitterProvider: {
    id: {
      required: true,
      unique: true,
      type: String,
    },
    username: {
      required: true,
      unique: true,
      type: String,
    },
    photo: {
      type: String,
    },
  },
  profileCreated: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("user", user);
