const mongoose = require("mongoose");
const express = require("express");
const Router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Token = require("../model/Token");
const Crypto = require("crypto");
const nodeMailer = require("nodemailer");

Router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(doc => {
      if (doc.length >= 1) {
        return res.status(409).json({
          message: `User Already Exits`
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              username: req.body.username,
              dateOfBirth: req.body.dateOfBirth,
              Phone: req.body.Phone
            });

            user.save(function(error) {
              if (error) {
                return res.status(500).json({ error: error });
              }

              const confirmToken = new Token({
                _userId: user._id,
                token: Crypto.randomBytes(16).toString("hex")
              });

              confirmToken.save(function(tokenError) {
                if (tokenError) {
                  return res.status(500).json({
                    error: tokenError
                  });
                }

                //Sending The Email With Token Verification

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
          }
        });
      }
    });
});

Router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(users => {
      if (users.length < 1) {
        return res.status(401).json({
          message: `Authentication Failed`
        });
      }

      bcrypt.compare(req.body.password, users[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: `Authentication Failed`
          });
        }

        if (result) {
          const token = jwt.sign(
            {
              email: users[0].email,
              userid: users[0]._id,
              username: users[0].username,
              Phone: users[0].Phone
            },
            process.env.JWT_KEY,
            { expiresIn: "5h" }
          );

          return res.status(200).json({
            message: `Authentication Successful`,
            token: token,
            userId: users[0]._id,
            email: users[0].email,
            username: users[0].username,
            dob: users[0].dateOfBirth,
            phone: users[0].Phone
          });
        }

        res.status(401).json({
          message: `Authentication Failed`
        });
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
});

module.exports = Router;
