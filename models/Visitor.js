import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    ip: {
      type: String, // Visitor IP address
      trim: true,
    },
    location:{
        type:Object
    },

    page: {
      type: String, // Which page user visited
      required: true,
      trim: true,
    },

    referrer: {
      type: String, // Traffic source (google, facebook, direct)
      default: "direct",
      trim: true,
    },

    userAgent: {
      type: Object, // Browser / device information
    },

    visitedAt: {
      type: Date, // Visit time
      default: Date.now, // Auto save current time
    },
  },
  {
    timestamps: true, // createdAt & updatedAt auto add হবে
  }
);

export default mongoose.model("Visitor", visitorSchema);
