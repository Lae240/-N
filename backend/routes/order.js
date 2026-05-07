const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// Lấy danh sách đơn hàng
router.get("/", async (req, res) => {
  const data = await Order.find().populate("productId");
  res.json(data);
});

// TẠO ĐƠN HÀNG
router.post("/", async (req, res) => {
  const { productId, quantity } = req.body;

  // 1. tìm sản phẩm
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json("Không tìm thấy sản phẩm");
  }

  // 2. kiểm tra tồn kho
  if (product.stock < quantity) {
    return res.status(400).json("Không đủ hàng trong kho");
  }

  // 3. tính tổng tiền
  const total = product.price * quantity;

  // 4. trừ tồn kho
  product.stock -= quantity;
  await product.save();

  // 5. tạo đơn hàng
  const order = new Order({
    productId,
    quantity,
    total,
    status: "Đang xử lý"
  });

  await order.save();

  res.json(order);
});

// XOÁ ĐƠN (TRẢ LẠI KHO)
router.delete("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    const product = await Product.findById(order.productId);

    if (product) {
      product.stock += order.quantity;
      await product.save();
    }

    await Order.findByIdAndDelete(req.params.id);
  }

  res.json("Đã xoá");
});

module.exports = router;
// CẬP NHẬT TRẠNG THÁI
router.put("/:id", async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(order);
});