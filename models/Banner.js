const { Schema, model } = require("mongoose");

const bannerSchema = new Schema(
  {
    image: {
      type: String, // stored image url or filename
      required: true,
    },

    title: {
      type: String,

      trim: true,
      maxlength: 150,
    },

    desc: {
      type: String,

      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt auto
  },
);

const Banner = model("Banner",bannerSchema)

module.exports = Banner
