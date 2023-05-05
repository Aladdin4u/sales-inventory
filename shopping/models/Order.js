const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  items: [
    {
      product: {
        _id: { type: String, require: true },
        name: { type: String },
        desc: { type: String },
        banner: { type: String },
        type: { type: String },
        unit: { type: Number },
        price: { type: Number },
        suplier: { type: String },
      },
      unit: { type: Number, require: true },
    },
  ],
});

module.exports = mongoose.model("Order", OrderSchema);
