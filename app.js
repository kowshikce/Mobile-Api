const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

//ALL THe DIfferent Routes That The APi ProvideS
//ARe Being Handled By The Flowing Section OF THE COde
const upcommingPhoneRoute = require("./api/routes/UpcommingPhones");
const phoneRoute = require("./api/routes/Phone");
const signupRoute = require("./api/routes/Users");
const EmailConfirmRoute = require("./api/routes/EmailConfirmationRoute");
const LogoutRoute = require("./api/routes/LogoutRoute");
const ResetPasswordRoute = require("./api/routes/ResetPasswordRoute");
const ResendTokenRoute = require("./api/routes/ResendToken");

//For The DataBase MongoDB OR Mongoose Wchic
//Internally Uses The Official CLient FOr Data
//Strorage And For Data Solutions.
mongoose.connect("mongodb://localhost:27017/users", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.Promise = global.Promise;

//CHecking FOr COnnection IF The COde Have Successfully
//Connected TO The MOngoDB SErver Or NOT
var db = mongoose.connection;
db.on("error", function() {
  console.error.bind(console, "MongoDB COnnection Error!");
});

db.on("open", function() {
  console.log("Successfully COnnected To THe MOngoDB");
});

//And For Loggin The Server Morgan Is
//Needed And The Whole System Would Be
//Using The Morgan Module
app.use(morgan("common"));

//Using Body Parser That Will Be Needed
//For Parsing Json Request From The CLient
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Handling CORS FOr THe APi TO WOkr WIth ANy DEvice Orign
//Here WE Are Handling The Cross-Origin-Resouces-Sharing
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Or18igin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//ROuting ALl INcomming APi Call FRom THe Client ANd Passing The ROute
app.use("/api/v1/upcommingphones", upcommingPhoneRoute);
app.use("/api/v1/brands", phoneRoute);
app.use("/api/v1/users", signupRoute);
app.use("/api/v1/confirmation", EmailConfirmRoute);
app.use("/api/v1/logout", LogoutRoute);
app.use("/api/v1/resetpassword", ResetPasswordRoute);
app.use("/api/v1/resendtoken", ResendTokenRoute);

//Handling All Image Request That will be provided by this Route ANd with
//TokenAuth For Validity
app.use("/api/v1/images", express.static("mongodbimage"));

//Handling INvalid Route OR THe Route That
//DOesn't Exits SO This Section HAndled The Route's
//That DOesn't Exits.
app.use((req, res, next) => {
  const error = new Error("Invalid Route.");

  error.status = 404;
  next(error);
});

//Error HAndligng Sections That CAN Handle Error ALl Over THE COde
//FOR INValid ROute
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    Error: error,
    Cause: `Route Doesn\'t Exits.`
  });
});

module.exports = app;
