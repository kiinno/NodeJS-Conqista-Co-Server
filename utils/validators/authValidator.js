const { body } = require("express-validator");
const { validationError } = require("../../middlewares/validationError");

exports.loginValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("username must be a string"),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("password must be a string"),
  validationError,
];

exports.signupValidator = [
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
    .withMessage("Password length must be between 10 and 64 characters")
    .custom((password, meta) => {
      if (password === meta.req.body.confirmPassword) return true;
      throw "Password and confirm password dose not match";
    }),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .isString()
    .withMessage("Confirm Password must be string"),

  validationError,
];

exports.updateLoggedUserValidator = [
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
  validationError,
];

exports.forgotPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be string")
    .isLength({ max: 64 })
    .withMessage(
      "Too long email address,  maximum characters is 64 characters"
    ),
  validationError,
];

exports.verifyResetCodeValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be string")
    .isLength({ max: 64 })
    .withMessage(
      "Too long email address,  maximum characters is 64 characters"
    ),
  body("code")
    .notEmpty()
    .withMessage("Code is required")
    .isString()
    .withMessage("Code must be string")
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid OTP code format"),
  validationError,
];

exports.resetPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isString()
    .withMessage("Email must be string")
    .isLength({ max: 64 })
    .withMessage(
      "Too long email address,  maximum characters is 64 characters"
    ),
  body("code")
    .notEmpty()
    .withMessage("Code is required")
    .isString()
    .withMessage("Code must be string")
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid OTP code format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be string")
    .isLength({ min: 10, max: 64 })
    .withMessage("Password length must be between 10 and 64 characters")
    .custom((password, meta) => {
      if (password === meta.req.body.confirmPassword) return true;
      throw "Password and confirm password dose not match";
    }),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .isString()
    .withMessage("Confirm Password must be string"),
  validationError,
];
