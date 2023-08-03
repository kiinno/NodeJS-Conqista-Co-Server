const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");

exports.validationError = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    next(
      new ApiError(
        400,
        "Invalid data format",
        "Validation Error",
        errors.mapped()
      )
    );
  next();
});
