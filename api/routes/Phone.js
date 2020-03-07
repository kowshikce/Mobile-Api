const express = require("express");
const Router = express.Router();
const Phones = require("../model/PhoneModel");
const authChecker = require("../middleware/authChecker");
const BlackTokenChecker = require("../middleware/BlackTokenChecker");
const path = require("path");

Router.get("/", BlackTokenChecker, authChecker, (req, res, next) => {
  let response = {
    date: new Date().toISOString(),
    request: `GET`,
    Message: ``,
    hostname: req.hostname,
    protocol: req.protocol,
    numberOfBrands: 0,
    numberOfModels: 0,
    models: [],
    smartphone: {},
    errors: [],
    brands: []
  };
  Phones.distinct("brand", function(err, result) {
    if (err) {
      response.errors.push(err);
      return res.status(500).json(response);
    }

    if (!err) {
      result.forEach(brand => {
        response.brands.push(brand);
      });
      response.Message = `OK`;
      response.numberOfBrands = result.length;
      return res.status(200).json(response);
    }

    response.Message = `ERROR`;
    res.status(500).json(response);
  });
});

Router.get("/:brand", BlackTokenChecker, authChecker, (req, res, next) => {
  let response = {
    date: new Date().toISOString(),
    request: `GET`,
    Message: ``,
    hostname: req.hostname,
    protocol: req.protocol,
    numberOfBrands: 0,
    numberOfModels: 0,
    models: [],
    smartphone: {},
    errors: [],
    brands: []
  };
  const brand = req.params.brand;
  Phones.find({ brand: brand })
    .exec()
    .then(models => {
      if (models.length <= 0) {
        response.Message = "NOT-FOUND";
        return res.status(401).json(response);
      }

      response.numberOfModels = models.length;
      response.models = models;
      response.Message = `OK`;
      res.status(200).json(response);
    })
    .catch(err => {
      response.errors.push(err);
      response.Message = `ERROR`;
      res.status(500).json(response);
    });
});

Router.get("/:brand/:id", BlackTokenChecker, authChecker, (req, res, next) => {
  const brand = req.params.brand;
  const id = req.params.id;

  let response = {
    date: new Date().toISOString(),
    request: `GET`,
    Message: ``,
    hostname: req.hostname,
    protocol: req.protocol,
    numberOfBrands: 0,
    numberOfModels: 0,
    models: [],
    smartphone: {},
    errors: [],
    brands: []
  };

  Phones.find({ _id: id, brand: brand })
    .exec()
    .then(models => {
      if (models.length <= 0) {
        response.Message = `NOT-FOUND`;
        return res.status(401).json(response);
      }

      response.numberOfModels = models.length;
      response.Message = `OK`;
      response.smartphone = models[0];
      res.status(200).json(response);
    })
    .catch(err => {
      response.errors.push(err);
      response.Message = `ERROR`;
      res.status(500).json(response);
    });
});

module.exports = Router;
