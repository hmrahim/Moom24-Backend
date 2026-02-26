const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  color: { type: String },
  unit: { type: String },
  size: { type: String },
  price: { type: String }
 
});

const quotationSchema = new mongoose.Schema({
  email: { type: String, required: true }, // Customer identity
  title: { type: String, required: true }, // Quotation title / date
  company: { type: String, required: true }, // Quotation title / date
  vatNo: { type: String, required: true }, // Quotation title / date
  phone: { type: String, required: true }, // Quotation title / date
  address: { type: String, required: true }, // Quotation title / date
  products: [productSchema],
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quotation", quotationSchema);
