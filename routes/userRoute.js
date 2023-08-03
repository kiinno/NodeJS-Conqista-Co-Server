const express = require("express");
const router = express.Router();

// Controllers
const {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} = require("../services/userService");

const { isAuthenticated } = require("../middlewares/guard");
const {
  deleteUserValidator,
  getUserValidator,
  createUserValidator,
  updateUserValidator,
} = require("../utils/validators/userValidator");
const {
  uploads,
  handleUploadedImage,
  sharpImage,
} = require("../utils/uploads");

router
  .route("/")
  .get(isAuthenticated(true), getAllUsers)
  .post(
    isAuthenticated(true),
    uploads.single("avatar"),
    handleUploadedImage("avatar"),
    createUserValidator,
    createUser,
    sharpImage
  );
router
  .route("/:userId")
  .get(isAuthenticated(true), getUserValidator, getUser)
  .put(
    isAuthenticated(true),
    uploads.single("avatar"),
    handleUploadedImage("avatar"),
    updateUserValidator,
    updateUser,
    sharpImage
  )
  .delete(isAuthenticated(true), deleteUserValidator, deleteUser);

module.exports = router;
