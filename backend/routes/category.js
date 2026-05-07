const router = require("express").Router();
const Category = require("../models/Category");

// GET
router.get("/", async (req, res) => {
  res.json(await Category.find());
});

// POST
router.post("/", async (req, res) => {
  const data = new Category(req.body);
  await data.save();
  res.json(data);
});

// PUT
router.put("/:id", async (req, res) => {
  res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

module.exports = router;