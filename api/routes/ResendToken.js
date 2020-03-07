const express = require("express");
const Router = express.Router();
const mongoose = require("mongoose");
const Token = require("../model/Token");
const nodeMailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../model/User");

Router.get("/", (req, res, next) => {
  const email = req.body.email;
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      console.log(err);
      return;
    }

    if (!user) {
      return res.status(400).json({
        message: `We Are Unable To Find The User. :<`
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: `That Accound Has Already Been Verified.`
      });
    }

    var confirmToken = new Token({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex")
    });

    confirmToken.save(function(tokenError) {
      if (tokenError) {
        return res.status(500).json({
          error: tokenError
        });
      }

      const transpoter = nodeMailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
          user: process.env.GEMAIL,
          pass: process.env.G_PSW
        }
      });
      const mailOptions = {
        from: "demo@gmail.com",
        to: user.email,
        subject: "Account Verification Token",
        text: `Hello,\n\n 
          Please verify your account by clicking the link: http://192.168.1.104:3000${process.env.E_CONFIRM_ROUTE}/${confirmToken.token} 
          `
      };

      transpoter.sendMail(mailOptions, function(mailError) {
        if (mailError) {
          return res.status(500).json({ error: mailError });
        }
        res.status(200).json({
          message: `A Verification Link Was Sent To ${user.email}`
        });
      });
    });
  });
});

module.exports = Router;
