mongoose = require("mongoose");
const { Schema } = mongoose;

CloudAddress = new Schema({
  address: String,
  mnemonic: String,
  privateKey: String,
});

module.exports = mongoose.model("CloudAddress", CloudAddress);
