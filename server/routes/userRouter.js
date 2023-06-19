const express = require("express");
const router = express.Router();
const controller = require("../controller/usercontroller");
const TokenVerify = require("../middleware/TokenVerify");

router.post("/createUser", controller.createUser);

router.post("/verifyUser", controller.verifyOtp);

router.post("/login", controller.Login);

router.post("/createTask", TokenVerify, controller.addTask);

router.delete("/removTask/:taskId", TokenVerify, controller.removeTask);

router.put("/updateTask/:taskId", TokenVerify, controller.updateTask);

router.get("/me", TokenVerify, controller.getUser);

module.exports = router;
