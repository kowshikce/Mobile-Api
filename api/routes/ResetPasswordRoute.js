const express = require("express");
const Router = express.Router();
const BlackToken = require("../model/blackToken");
const User = require("../model/User");
const AuthChecker = require("../middleware/authChecker");
const BlackTokenChecker = require("../middleware/BlackTokenChecker");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

Router.post("/:userId", BlackTokenChecker, AuthChecker, (req, res, next) => {
  const id = req.params.userId;
  const email = req.body.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const blockToken = req.headers.authorization.split(" ")[1];

  User.findOne({ _id: id, email: email }, function(err, user) {
    if (err) {
      console.log(err);
      return;
    }

    if (user) {
      if (bcrypt.compareSync(oldPassword, user.password)) {
        bcrypt.hash(newPassword, 10, (bcryptErr, hash) => {
          if (bcryptErr) {
            console.log(bcryptErr);
            return;
          } else {
            user.updateOne({ password: hash }, function(error, result) {
              if (error) {
                return res.status(500).json({
                  message: error.message
                });
              }

              if (result) {
                const black = new BlackToken({
                  _id: new mongoose.Types.ObjectId(),
                  blockToken: blockToken
                });
                black.save(function(tokenError) {
                  if (tokenError) {
                    console.log(tokenError);
                    return;
                  }

                  return res.status(201).json({
                    message: result
                  });
                });
              }

              if (!result) {
                res.status(500).json({
                  message: `Unknown Error`
                });
              }
            });
          }
        });
      } else {
        return res.status(400).json({
          message: `Wrong Password`
        });
      }
    }

    if (!user) {
      res.status(404).json({
        message: `Couldn't Find Any Users. :(`
      });
    }
  });
});

module.exports = Router;
