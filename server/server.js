const express = require("express");
const app = express();

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

app.listen(process.env.PORT, () => {
  console.log(`server on port ${process.env.PORT}`);
});
