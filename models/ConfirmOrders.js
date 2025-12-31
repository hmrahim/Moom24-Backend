const { Schema, model } = require("mongoose");
const confirmOrderSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    orders: {
      type: Array,
      default: [],
    },
    address: {
      type: Object,
      default: {},
    },
   
    status: {
      type: String,
      default: "unconfirmed",
      trim: true,
    },
    seen: {
      type: String,
      default: "unseen",
      trim: true,
    },
    payType: {
      type: String,
      default: " ",
      trim: true,
    },
    orderNo: {
      type: String,
      trim: true,
    },
    distence: {
      type: String,
      trim: true,
    },
    totalAmount: {
      type: String,
      trim: true,
      default: " ",
    },
  },
  { timestamps: true }
);
const ConfirmOrder = model("ConfirmOrder", confirmOrderSchema);
module.exports = ConfirmOrder;
