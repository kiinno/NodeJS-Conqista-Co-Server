const bcrypt = require("bcrypt");
const fs = require("fs");

const path = require("path");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const otpGenerator = require("otp-generator");
const { SECRET_KEY, STRONG_KEYWORD, JWT_IAT } = process.env;
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [2, "Too short first name"],
      maxLength: [24, "Too long first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minLength: [2, "Too short last name"],
      maxLength: [24, "Too long last name"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      minLength: [5, "Too short username"],
      maxLength: [32, "Too long username"],
      trim: true,
      lowercase: true,
      unique: [true, "Username already exists"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      maxLength: [64, "Too long email address"],
      trim: true,
      unique: [true, "Email address already in use"],
    },
    avatar: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [10, "Too short password"],
      maxLength: [128, "Too long email address"],
      trim: true,
      set: (value) => {
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(
          `${value}.${STRONG_KEYWORD}`,
          salt
        );
        return hashedPassword;
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
  },
  { timestamps: true }
);

userSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(`${password}.${STRONG_KEYWORD}`, this.password);
};

userSchema.methods.genResetCode = function (expiresAfter = 10) {
  const otp = otpGenerator.generate(6, {
    digits: true,
    specialChars: false,
    lowerCaseAlphabets: true,
    upperCaseAlphabets: true,
  });

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp.toString())
    .digest("hex");

  const expiresIn = Date.now() + expiresAfter * 60 * 1000;

  return { otp, expiresIn, hashedOtp };
};

userSchema.methods.isValidResetCode = function (otp) {
  if (!otp) return false;

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp.toString())
    .digest("hex");

  if (
    this.passwordResetCode &&
    this.passwordResetCode === hashedOtp &&
    Date.now() < this.passwordResetExpires
  ) {
    return true;
  }

  return false;
};

userSchema.methods.genToken = function () {
  return jwt.sign({ id: this._id }, SECRET_KEY, {
    expiresIn: JWT_IAT,
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
