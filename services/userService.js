const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const data = await User.find();
  res.status(200).json({ data });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const data = await User.findById(req.params.userId);
  if (!data)
    return res
      .status(404)
      .json({ name: "User Not Found", message: "No user exists with this id" });
  res.status(200).json({ data });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const data = await User.findOneAndDelete(req.params.storeItemId);
  if (!data)
    return res
      .status(404)
      .json({ name: "User Not Found", message: "No user exists with this id" });
  res.status(200).json({ data });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const data = await User.findByIdAndUpdate(req.params.storeItemId);
  if (!data)
    return res
      .status(404)
      .json({ name: "User Not Found", message: "No user exists with this id" });
  res.status(200).json({ data });
  next();
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const data = await User.create(req.body);
  res.status(201).json({ data });
  next();
});
