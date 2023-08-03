const { body, param } = require("express-validator");
const { default: slugify } = require("slugify");
const { validationError } = require("../../middlewares/validationError");
const User = require("../../models/userModel");

const validateUserId = param("userId", "Invalid user id format")
  .isMongoId()
  .custom(async (id, meta) => {
    const item = await User.findById(id);
    if (!item) throw `No user exists with this id ${id}`;
    return true;
  });

exports.createUserValidator = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be string")
    .isLength({ min: 2, max: 24 })
    .withMessage("First name length must be between 2 and 24 characters"),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be string")
    .isLength({ min: 2, max: 24 })
    .withMessage("Last name length must be between 2 and 24 characters"),

  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be string")
    .isLength({ min: 6, max: 32 })
    .withMessage("Username length must be between 6 and 32 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be string")
    .isLength({ max: 64 })
    .withMessage(
      "Too long email address,  maximum characters is 64 characters"
    ),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be string")
    .isLength({ min: 10, max: 64 })
    .withMessage("Password length must be between 10 and 64 characters"),

  body("isAdmin")
    .optional()
    .isBoolean()
    .withMessage("value must be a boolean value"),
  validationError,
];

exports.getUserValidator = [validateUserId, validationError];

exports.updateUserValidator = [
  validateUserId,
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be string")
    .isLength({ min: 2, max: 24 })
    .withMessage("First name length must be between 2 and 24 characters"),

  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be string")
    .isLength({ min: 2, max: 24 })
    .withMessage("Last name length must be between 2 and 24 characters"),

  body("username")
    .optional()
    .isString()
    .withMessage("Username must be string")
    .isLength({ min: 6, max: 32 })
    .withMessage("Username length must be between 6 and 32 characters"),

  body("email")
    .optional()
    .isString()
    .withMessage("Email must be string")
    .isLength({ max: 64 })
    .withMessage(
      "Too long email address,  maximum characters is 64 characters"
    ),

  body("password")
    .optional()
    .isString()
    .withMessage("Password must be string")
    .isLength({ min: 10, max: 64 })
    .withMessage("Password length must be between 10 and 64 characters"),

  body("isAdmin")
    .optional()
    .isBoolean()
    .withMessage("value must be a boolean value"),
  validationError,
];

exports.deleteUserValidator = [validateUserId, validationError];
