const router = require("express").Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  res.json(await Product.find());
});

router.post("/", async (req, res) => {
  const data = new Product(req.body);
  await data.save();
  res.json(data);
});

router.put("/:id", async (req, res) => {
  res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

module.exports = router;