const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: mongoose.Schema.Types.Date },
  username: { type: String, required: true, minlength: 2, maxlength: 30 },
  dateOfBirth: { type: String, required: true, minlength: 6, maxlength: 10 },
  Phone: { type: String, minlength: 11, maxlength: 11 },
  createdAt: { type: mongoose.Schema.Types.Date, default: Date.now() }
});

module.exports = mongoose.model("UserAccount", UserSchema);
