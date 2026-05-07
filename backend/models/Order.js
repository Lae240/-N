const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: Number,
  total: Number,
  status: {
    type: String,
    default: "Đang xử lý"
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);