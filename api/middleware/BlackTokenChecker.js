const blackToken = require("../model/blackToken");

module.exports = (req, res, next) => {
  const bToken = req.headers.authorization.split(" ")[1];
  blackToken.findOne({ blockToken: bToken }, function(err, result) {
    if (err) {
      return res.status(500).json({
        message: err
      });
    }

    if (result) {
      return res.status(400).json({
        message: `Sorry, Invalid Token.`
      });
    }

    if (!result) {
      req.body.validToken = bToken;
      next();
    }
  });
};
