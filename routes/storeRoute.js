const express = require("express");
const router = express.Router();

// Controllers
const {
  createStoreItem,
  deleteStoreItem,
  getAllStoreItems,
  getStoreItem,
  updateStoreItem,
} = require("../services/storeService");

const { isAuthenticated } = require("../middlewares/guard");

const {
  createStoreItemValidator,
  deleteStoreItemValidator,
  getStoreItemValidator,
  updateStoreItemValidator,
} = require("../utils/validators/storeValidator");

router
  .route("/")
  .get(getAllStoreItems)
  .post(isAuthenticated(true), createStoreItemValidator, createStoreItem);

router
  .route("/:storeItemId")
  .get(getStoreItemValidator, getStoreItem)
  .put(isAuthenticated(true), updateStoreItemValidator, updateStoreItem)
  .delete(isAuthenticated(true), deleteStoreItemValidator, deleteStoreItem);

module.exports = router;
