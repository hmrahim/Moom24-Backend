const { Schema, model } = require("mongoose");
const quotProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

}, {
    timestamps: true, // createdAt & updatedAt auto
});

const QuotProducts = model("QuotProduct", quotProductSchema)

module.exports = QuotProducts
