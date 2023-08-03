const { body, param } = require("express-validator");
const { default: slugify } = require("slugify");
const { validationError } = require("../../middlewares/validationError");
const Store = require("../../models/storeModel");

const validateItemId = param("storeItemId", "Invalid store item id format")
  .isMongoId()
  .custom(async (id, meta) => {
    const item = await Store.findById(id);
    if (!item) throw `No store item exists with this id ${id}`;
    return true;
  });

exports.createStoreItemValidator = [
  body("name")
    .notEmpty()
    .withMessage("Store item name is required")
    .isString()
    .withMessage("Store item name must be string")
    .isLength({ min: 3, max: 64 })
    .withMessage("Store item name length must be between 3 and 64 characters")
    .custom(async (name, meta) => {
      const item = await Store.findOne({ name });
      if (item) throw `This item '${name}' already exists in the store`;
      return true;
    })
    .custom((val, meta) => {
      meta.req.body.slug = slugify(val, {
        lower: true,
        trim: true,
      });
      return true;
    }),
  body("description")
    .notEmpty()
    .withMessage("Store item description is required")
    .isString()
    .withMessage("Store item description must be string")
    .isLength({ min: 10, max: 128 })
    .withMessage(
      "Store item description length must be between 3 and 64 characters"
    ),
  body("price")
    .notEmpty()
    .withMessage("Store item price is required")
    .isFloat({ gt: 0 })
    .withMessage("Store item price must be a number greater than 0"),
  body("discount")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Store item discount must be a number between 0 and 100"),
  validationError,
];

exports.getStoreItemValidator = [validateItemId, validationError];

exports.updateStoreItemValidator = [
  validateItemId,
  body("name")
    .optional()
    .isString()
    .withMessage("Store item name must be string")
    .isLength({ min: 3, max: 64 })
    .withMessage("Store item name length must be between 3 and 64 characters")
    .custom(async (name, meta) => {
      const item = await Store.findOne({ name });
      if (item) throw `This item '${name}' already exists in the store`;
      return true;
    })
    .custom((val, meta) => {
      meta.req.body.slug = slugify(val, {
        lower: true,
        trim: true,
      });
      return true;
    }),
  body("description")
    .optional()
    .isString()
    .withMessage("Store item description must be string")
    .isLength({ min: 10, max: 128 })
    .withMessage(
      "Store item description length must be between 3 and 64 characters"
    ),
  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Store item price must be a number greater than 0"),
  body("discount")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Store item discount must be a number between 0 and 100"),
  validationError,
];

exports.deleteStoreItemValidator = [validateItemId, validationError];
