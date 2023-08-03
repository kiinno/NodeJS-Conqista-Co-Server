const mongoose = require("mongoose");
const slugify = require("slugify");
const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "store item name is required"],
      minLength: [3, "Too short store item name"],
      maxLength: [64, "Too long store item name"],
      trim: true,
      unique: [true, "Store item already exists"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "store item description is required"],
      minLength: [10, "Too short store item description"],
      maxLength: [128, "Too long store item description"],
      trim: true,
    },
    price: {
      type: Number,
      min: [1, "Minimum price is 1"],
    },
    discount: {
      type: Number,
      min: [0, "Minimum discount is 0"],
      max: [100, "Maximum discount is 100"],
      default: 0,
    },
    __v: {
      type: Number,
      selected: false,
    },
  },
  { timestamps: true }
);
const Store = mongoose.model("Store", storeSchema);

module.exports = Store;
