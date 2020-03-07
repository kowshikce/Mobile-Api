const mongoose = require("mongoose");

const blackTokenSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  blockToken: { type: String, required: true },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now(),
    expires: 21600
  }
});

module.exports = mongoose.model("BlackTokenSchema", blackTokenSchema);
