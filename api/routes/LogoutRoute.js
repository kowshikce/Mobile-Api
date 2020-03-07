const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
const BlackTokenChecker = require("../middleware/BlackTokenChecker");
const BlackToken = require("../model/blackToken");
const AuthChecker = require("../middleware/authChecker");

Router.post("/:id", BlackTokenChecker, AuthChecker, (req, res, next) => {
  const token = req.body.validToken;
  const blackToken = new BlackToken({
    _id: new mongoose.Types.ObjectId(),
    blockToken: token
  });

  blackToken.save(function(err) {
    if (err) {
      return res.status(500).json({
        message: `Error Occured`
      });
    }

    res.status(201).json({
      message: `Successful`
    });
  });
});

module.exports = Router;
