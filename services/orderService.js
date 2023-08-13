const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ApiError = require("../utils/apiError");

const Order = require("../models/orderModel");
const Store = require("../models/storeModel");

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const storeItem = await Store.findById(id);

  if (!storeItem)
    return next(new ApiError(404, `No such item in store with this id ${id}`));

  // create a new striep session
  console.log(req.auth);
  const { email, firstName, lastName, _id } = req.auth.user;

  const newPrice = (
    storeItem.price -
    (storeItem.price / 100) * (storeItem.discount ?? 0)
  ).toFixed(1);

  const metadata = {
    id: storeItem._id,
    price: storeItem.price,
    discount: storeItem.discount,
    newPrice,
  };

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount_decimal: (newPrice * 100).toFixed(2),
          product_data: {
            name: storeItem.name,
            description: storeItem.description,
            metadata,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    client_reference_id: storeItem._id,
    customer_email: email,
    metadata: {
      ...metadata,
      user: `${firstName} ${lastName}`,
      userId: _id,
      email,
    },
    success_url: `http://localhost:3000/orders`,
    cancel_url: `http://localhost:3000/store`,
  });

  res.status(200).json({ session });
});
