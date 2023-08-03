const express = require("express");
const router = express.Router();

// Controllers
const {
  login,
  getLoggedUserData,
  signup,
  updateLoggedUser,
  updateLoggedAvatar,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authService");
const { isAuthenticated } = require("../middlewares/guard");
const {
  loginValidator,
  signupValidator,
  updateLoggedUserValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyResetCodeValidator,
} = require("../utils/validators/authValidator");

const {
  uploads,
  handleUploadedImage,
  sharpImage,
} = require("../utils/uploads");

router.post("/login", loginValidator, login);
router.post("/signup", signupValidator, signup);

router.post(
  "/update_logged_user",
  isAuthenticated(),
  uploads.single("avatar"),
  handleUploadedImage("avatar"),
  updateLoggedUserValidator,
  updateLoggedUser,
  sharpImage
);

router.post(
  "/update_logged_avatar",
  isAuthenticated(),
  uploads.single("avatar"),
  handleUploadedImage("avatar"),
  updateLoggedAvatar,
  sharpImage
);

router.post("/logged_user", isAuthenticated(), getLoggedUserData);

router.post("/forgot_password", forgotPasswordValidator, forgotPassword);
router.post("/verify_reset_code", verifyResetCodeValidator, verifyResetCode);
router.post("/reset_password", resetPasswordValidator, resetPassword);

module.exports = router;
