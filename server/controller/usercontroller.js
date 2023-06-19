const SendEmail = require("../middleware/SendEamil");
const UserModel = require("../model/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
  createUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          mesaage: "Plaese Enter All the Fields",
        });
      }

      //   const { avatar } = req.files;

      let user = await UserModel.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          mesaage: "Email Alredy Exist Please Login",
        });
      }
      const OTP = Math.floor(Math.random() * 999 + 1000);
      const newUser = await UserModel.create({
        name,
        email,
        password,
        avatar: {
          public_id: "bcbcbcbiuc",
          url: "csjdsdiudgidg",
        },
        OTP,
        OTP_expire: Date.now() + 5 * 60 * 1000,
      });
      const message = `Hello ${name}, Your OTP is ${OTP}`;

      try {
        await SendEmail({
          email,
          subject: "Plaese Verify Your Account",
          message,
        });
        res.status(200).json({
          success: true,
          message: "We send an OTP on you Email Please Chcek",
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.mesaage,
        });
      }

      //   const Token = await jwt.sign({ _id: newUser._id }, process.env.JWT_KEY, {
      //     expiresIn: "7d",
      //   });
    } catch (error) {
      res.status(400).json({
        success: false,
        mesaage: error.mesaage,
      });
    }
  },

  //   ------------- verify user
  verifyOtp: async function (req, res) {
    const { OTP } = req.body;
    if (!OTP) {
      return res.status(400).json({
        success: false,
        message: "Please enter OTP",
      });
    }

    const user = await UserModel.findOne({ OTP: OTP });
    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Incorrect OTP. Your account will be deleted after 5 minutes. Please retry OTP",
      });
    }

    if (user.verify === true) {
      return res.status(400).json({
        success: false,
        message: "Your account is already verified. Please login.",
      });
    }
    if ((user && user.OTP === OTP) || user.OTP_expire < Date.now()) {
      user.verify = true;
      user.OTP_expire = null;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Successful verification. Please login.",
      });
    } else {
      await UserModel.findByIdAndDelete(user._id);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please retry.",
      });
    }
  },

  // ---------------- login user
  Login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          mesaage: "Please Enter All Fields",
        });
      }
      const isUser = await UserModel.findOne({ email });
      if (!isUser) {
        return res.status(400).json({
          success: false,
          mesaage: "Inalid Email Password",
        });
      }
      if (isUser.verify !== true) {
        return res.status(400).json({
          success: false,
          mesaage: "Please first verify your account",
        });
      }

      const Token = await jwt.sign({ _id: isUser._id }, process.env.JWT_KEY, {
        expiresIn: "7d",
      });

      const isMatch = await bcrypt.compare(password, isUser.password);
      if (isMatch) {
        res.status(200).cookie("token", Token).json({
          success: false,
          mesaage: "Login Successfuly",
          isUser,
          Token,
        });
      } else {
        res.status(400).json({
          success: false,
          mesaage: "Inavlid Email or Password",
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        mesaage: error.mesaage,
      });
    }
  },

  // ------------- get user
  getUser: async (req, res) => {
    try {
      const user = await UserModel.findById(req.user._id);
      res.status(200).json({
        user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        mesaage: error.mesaage,
      });
    }
  },
  // --------------- addtask
  addTask: async (req, res) => {
    try {
      const { title, description } = req.body;

      const user = await UserModel.findById(req.user._id);
      user.task.push({
        title,
        description,
        completed: false,
        createdAt: new Date(Date.now()),
      });

      await user.save();

      res
        .status(200)
        .json({ success: true, message: "Task added successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  //   ----------------- removeTask
  removeTask: async (req, res) => {
    try {
      const { taskId } = req.params;

      const user = await UserModel.findById(req.user._id);

      user.task = user.task.filter(
        (task) => task._id.toString() !== taskId.toString()
      );

      await user.save();

      res
        .status(200)
        .json({ success: true, message: "Task removed successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  //   ------------updatetask
  updateTask: async (req, res) => {
    try {
      const { taskId } = req.params;

      const user = await UserModel.findById(req.user._id);

      user.task = user.task.find(
        (task) => task._id.toString() === taskId.toString()
      );

      user.task.completed = !user.task.completed;

      await user.save();

      res
        .status(200)
        .json({ success: true, message: "Task Updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
