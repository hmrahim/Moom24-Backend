const { model, Schema, default: mongoose } = require("mongoose");

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

const Contact = model("Contact", contactSchema);

module.exports = Contact
