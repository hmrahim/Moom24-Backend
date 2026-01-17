const { Schema, model } = require("mongoose");

const variantSchema = new Schema({
  color: String,
  size: String,
  price: Number,
  stock: Number,
  images: String,

  // id না দিলেও Mongoose _id দিবে automatically
});
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    minQty: {
      type: Number,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    image: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    country: {
      type: String,
      required: true,
      trim: true,
    },
    discount: {
      type: String,
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    variants: {
      type: [variantSchema],
      required: true,
    },
  },

  { timestamps: true }
);
const Product = model("Product", productSchema);
module.exports = Product;
