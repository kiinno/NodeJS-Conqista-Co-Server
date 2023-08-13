const express = require("express");
const router = express.Router();

// Controllers
const { checkoutSession } = require("../services/orderService");

const { isAuthenticated } = require("../middlewares/guard");
const { param } = require("express-validator");

router.get(
  "/create-checkout/:id",
  isAuthenticated(),
  param("id", "Invalid Store Item ID").isMongoId(),
  checkoutSession
);
module.exports = router;
