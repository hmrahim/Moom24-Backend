const { Schema, model } = require("mongoose");

const offerSchema = new Schema(
  {
    title: {
      type: String, // stored image url or filename
      required: true,
    },

    minAmount: {
      type: String,

      trim: true,
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt auto
  },
);

const Offer = model("Offer", offerSchema);

module.exports = Offer;
