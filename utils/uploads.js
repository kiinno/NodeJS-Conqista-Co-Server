const path = require("path");

const multer = require("multer");
const asyncHandler = require("express-async-handler");
const { randomUUID, randomInt } = require("crypto");
const sharp = require("sharp");
const ApiError = require("./apiError");

const memoryStorage = multer.memoryStorage();
const { UPLOADS_ROUTE, UPLOADS_PATH } = process.env;

const uploads = multer({
  storage: memoryStorage,
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) return cb(null, true);
    cb(
      new ApiError(
        422,
        `File mimetype is not allowed ${file.mimetype} only images allowed`,
        "File Not Allowed",
        file
      ),
      true
    );
  },
});

const handleUploadedImage = (to) =>
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      const filePath = path.join(__dirname, "..", UPLOADS_PATH, to);
      const ext = req.file.mimetype.split("/")[1];
      const uniqueSuffix = `${randomUUID()}-${Date.now()}-${randomInt(
        1e2
      )}.${ext}`;
      const url = `${UPLOADS_ROUTE}/avatar/${uniqueSuffix}`;
      req.file.originalname = uniqueSuffix;
      req.file.saveIn = filePath;
      req.file.url = url;
      req.body[req.file.fieldname] = url;
    }
    next();
  });

const sharpImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(320, 320)
      .jpeg()
      .toFile(path.join(req.file.saveIn, req.file.originalname));
  }
});

module.exports = { uploads, handleUploadedImage, sharpImage };
