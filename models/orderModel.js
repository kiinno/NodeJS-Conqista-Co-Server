const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    purchased: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Store",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
