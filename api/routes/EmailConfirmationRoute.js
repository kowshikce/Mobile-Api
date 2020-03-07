const mongoose = require("mongoose");
const Token = require("../model/Token");
const express = require("express");
const Router = express.Router();
const crypto = require("crypto");
const User = require("../model/User");

Router.get("/:tokenId", (req, res, next) => {
  const id = req.params.tokenId;

  Token.findOne({ token: id }, function(err, token) {
    if (!token) {
      return res.status(400).json({
        message: `Non-Verified, Unable To Find Token Or Your Token May Have Been Expired`
      });
    }

    User.findOne({ _id: token._userId, email: req.body.email }, function(
      userError,
      user
    ) {
      if (!user) {
        return res.status(400).json({
          message: `We Are Unable To Find A Token For This Token.`
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          message: `Already Verified. This Users Have Been Already Verified.`
        });
      }

      user.isVerified = true;
      user.save(function(error) {
        if (error) {
          return res.status(500).json({
            error: error
          });
        }

        res
          .status(200)
          .json({ message: `User Already Have Been Verified. Please Log In.` });
      });
    });
  });
});

module.exports = Router;
