const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/native")
  .then(() => {
    console.log("mongoose connect");
  })
  .catch(() => {
    console.log("mongoose not connect");
  });
