const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = (private = false) =>
  asyncHandler(async (req, res, next) => {
    let token = req.get("Authorization");
    if (!token)
      return next(
        new ApiError(
          401,
          "You are not authorized to made this action or access this page."
        )
      );
    if (token.startsWith("Bearer ")) token = token.split(" ")[1];
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(payload.id);

    if (!user)
      return next(new ApiError(401, "User recently deleted this account."));

    if (private && user.isAdmin === private)
      return next(
        new ApiError(401, "Only admins are allowed to made this action")
      );
    // TODO: User should be recenlty changed hir password check if token is created after user change password

    if (user.passwordChangedAt && payload.iat * 1000 < user.passwordChangedAt) {
      return next(
        new ApiError(401, "Invalid authorization data, please login again")
      );
    }

    req.auth = {
      user,
      token: req.get("Authorization"),
      loginAt: new Date(payload.iat * 1000),
      expiresIn: new Date(payload.exp * 1000),
    };
    next();
  });
