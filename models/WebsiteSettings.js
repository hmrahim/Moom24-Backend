const { model, Schema } = require("mongoose");

const websiteSettingSchema = new Schema(
  {
    websiteName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },

    copyright: {
      type: String,
      required: true,
    },

    aboutText: {
      type: String,
    },

    logo: {
      displayUrl: { type: String, default: "" },
      deleteUrl: { type: String, default: "" },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "website_setting",
      unique: true,
    },
  },
  { timestamps: true }
);

const WebsiteSetting = model("WebsiteSetting", websiteSettingSchema);

module.exports = WebsiteSetting;
