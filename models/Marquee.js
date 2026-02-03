const { Schema, model } = require("mongoose");

const marqueeSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 300
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

const Marquee = model("Marquee", marqueeSchema);

module.exports = Marquee;
