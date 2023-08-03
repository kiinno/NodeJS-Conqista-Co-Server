const asyncHandler = require("express-async-handler");
const Store = require("../models/storeModel");

exports.getAllStoreItems = asyncHandler(async (req, res, next) => {
  const data = await Store.find();
  res.status(200).json({ data });
});

exports.getStoreItem = asyncHandler(async (req, res, next) => {
  const data = await Store.findById(req.params.storeItemId);
  if (!data)
    return res.status(404).json({
      name: "Item Not Found",
      message: "No store item exists with this id",
    });
  res.status(200).json({ data });
});

exports.deleteStoreItem = asyncHandler(async (req, res, next) => {
  const data = await Store.findByIdAndDelete(req.params.storeItemId);
  if (!data)
    return res.status(404).json({
      name: "Item Not Found",
      message: "No store item exists with this id",
    });
  res.status(200).json({ data });
});

exports.updateStoreItem = asyncHandler(async (req, res, next) => {
  const data = await Store.findByIdAndUpdate(req.params.storeItemId, req.body, {
    new: true,
  });
  if (!data)
    return res.status(404).json({
      name: "Item Not Found",
      message: "No store item exists with this id",
    });
  res.status(200).json({ data });
});

exports.createStoreItem = asyncHandler(async (req, res, next) => {
  const data = await Store.create(req.body);
  res.status(201).json({ data });
});
