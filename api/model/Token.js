const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  token: { type: String, required: true },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    required: true,
    default: Date.now(),
    expires: 1800
  }
});

module.exports = mongoose.model("Tokens", tokenSchema);
