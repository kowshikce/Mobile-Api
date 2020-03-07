const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const BlackTokenChecker = require("../middleware/BlackTokenChecker");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: `Handaling ${req.protocol}://${req.hostname} To ${process.env.BASE}`
  });
});

module.exports = router;
