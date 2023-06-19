const express = require("express");
const app = express();
const cloudinary = require("cloudinary");

// ------------ doten
require("dotenv").config();

// ------------------ mongoose connection
require("./db/conn");

// ------------- cookie parser
var cookieParser = require("cookie-parser");
app.use(cookieParser());

// body-parser
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// ------------------ router
app.use("/", require("./routes/userRouter"));
// ======== cloudinary
cloudinary.config({
  cloud_name: "dvgvcifrd",
  api_key: "651412252829259",
  api_secret: "RC4IM6i6t_oginPt9h1os5C5BBw",
});

app.listen(process.env.PORT, () => {
  console.log(`server on port ${process.env.PORT}`);
});
