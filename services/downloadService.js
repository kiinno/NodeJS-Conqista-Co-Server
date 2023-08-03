const asyncHandler = require("express-async-handler");
const path = require("path");

exports.sendDownloadFile = (...filePath) =>
  asyncHandler(async (req, res, next) => {
    res
      .status(200)
      .download(path.join(__dirname, "..", "downloads", ...filePath));
  });
