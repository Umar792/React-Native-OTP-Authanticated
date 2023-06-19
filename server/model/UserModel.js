const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your UserName"],
  },
  email: {
    type: String,
    required: [true, "Plaese Enter Your Email Adress"],
    unique: true,
    validate: [validator.isEmail, "Plaese Enter Valid Email Adress"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minlength: [6, "Password Must Be More Than Six Characters"],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  verify: {
    type: Boolean,
    default: false,
  },
  task: [
    {
      title: String,
      description: String,
      completed: Boolean,
      createdAt: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  OTP: Number,
  OTP_expire: Date,
});

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hashSync(this.password, 10);
  }
});

UserSchema.index({ OTP_expire: 1 }, { expireAfterSeconds: 0 });

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
