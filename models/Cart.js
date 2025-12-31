const { Schema, model } = require("mongoose");
const cartSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    id: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    discount: {
      type: String,
      trim: true,
    },
    quantity: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);
const Cart = model("Cart", cartSchema);
module.exports = Cart;
