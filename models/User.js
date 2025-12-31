const { model, Schema, default: mongoose } = require("mongoose");
const ConfirmOrder = require("./ConfirmOrders");
const useerSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  rol: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  orders:[
    {
      type: mongoose.Types.ObjectId,
      ref:"ConfirmOrder"
    }
  ]
});

const User = model("User",useerSchema)
module.exports = User
