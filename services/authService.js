const fs = require("fs");
const path = require("path");

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && (await user.comparePasswords(password)))
    return res.status(200).json({
      user,
      token: user.genToken(),
    });

  next(
    new ApiError(404, "invalid username or password", "Login failed", {
      username: username,
      password: password,
    })
  );
});

exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    ...req.auth,
  });
});

exports.signup = asyncHandler(async (req, res, next) => {
  const { username, password, email, firstName, lastName } = req.body;
  const user = await User.create({
    username,
    password,
    email,
    firstName,
    lastName,
  });

  res.status(200).json({
    user,
    token: user.genToken(),
  });
});

exports.updateLoggedUser = asyncHandler(async (req, res, next) => {
  const BASE_DIR = path.join(__dirname, "..");
  const { username, email, firstName, lastName, avatar } = req.body;
  const user = await User.findById(req.auth.user._id);

  if (avatar) {
    if (fs.existsSync(path.join(BASE_DIR, user.avatar)))
      fs.unlinkSync(path.join(BASE_DIR, user.avatar));
    user.avatar = avatar;
  }

  user.username = username ?? user.username;
  user.email = email ?? user.email;
  user.firstName = firstName ?? user.firstName;
  user.lastName = lastName ?? user.lastName;

  res.status(200).json({
    user: await user.save({ new: true }),
  });

  if (req.file) next();
});

exports.updateLoggedAvatar = asyncHandler(async (req, res, next) => {
  const { avatar } = req.body;
  const user = await User.findById(req.auth.user._id);

  const BASE_DIR = path.join(__dirname, "..");
  if (fs.existsSync(path.join(BASE_DIR, user.avatar)))
    fs.unlinkSync(path.join(BASE_DIR, user.avatar));

  user.avatar = avatar;

  res.status(200).json({
    user: await user.save({ new: true }),
  });

  if (req.file) next();
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new ApiError(
        404,
        "No user exists with this email address",
        "User not found",
        { email: req.body.email }
      )
    );

  const otp = user.genResetCode();
  user.passwordResetCode = otp.hashedOtp;
  user.passwordResetExpires = otp.expiresIn;

  await user.save();

  // TODO: Send otp to user email

  res.status(200).json({
    message: `Reset code sent successfully, please check ${user.email}`,
    otp,
  });
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new ApiError(
        404,
        "No user exists with this email address",
        "User not found",
        { email: req.body.email }
      )
    );

  if (!user.isValidResetCode(code))
    return next(
      new ApiError(
        400,
        "Not valid reset code or expired",
        "Invalid Reset Code",
        {
          email: req.body.email,
          code: code,
        }
      )
    );
  user.passwordResetVerified = true;
  await user.save();
  res.sendStatus(200);
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(
      new ApiError(
        404,
        "No user exists with this email address",
        "User not found",
        { email, code }
      )
    );

  if (!user.isValidResetCode(code) || !user.passwordResetVerified)
    return next(
      new ApiError(
        400,
        "Not valid reset code or expired",
        "Invalid Reset Code",
        { email, code }
      )
    );

  user.passwordChangedAt = Date.now();
  user.password = password;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save({
    new: true,
  });

  res.status(200).json({ user, token: user.genToken() });
});
