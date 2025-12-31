import mongoose from "mongoose";

const promocodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
      uppercase: true, 
    },
    description: {
      type: String,
      default: "",
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"], 
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0, 
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
    },
    maxDiscountAmount: {
      type: Number,
      default: null, 
    },
    usageLimit: {
      type: Number,
      default: null, 
    },
    usedCount: {
      type: Number,
      default: 0, 
    },
    startDate: {
      type: Date,
      default: Date.now, 
    },
    endDate: {
      type: Date,
      required: true, 
    },
    isActive: {
      type: Boolean,
      default: true, 
    },
  
  },
  { timestamps: true } 
);

export default mongoose.model("Promocode", promocodeSchema);
