const otpController = require("../controllar/authController.js"); // Import at the top for performance
const guideController = require("../controllar/guideController.js");
const userController = require("../controllar/userController.js");
const express = require("express");
const router = express.Router();

router.post("/send-otp", otpController.sendOtp);
router.post("/resend-otp", otpController.resendOtp);
router.post("/verify-otp", otpController.verifyOtp);
router.post("/register-guide", guideController);
router.post("/register-user", userController);


module.exports = router;
