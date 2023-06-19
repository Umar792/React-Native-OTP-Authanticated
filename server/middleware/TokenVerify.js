const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel");

const TokenVerify = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    // const token = req.headers["token"];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token Expire Please Login",
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_KEY);
    req.user = await UserModel.findById(decoded._id);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = TokenVerify;
