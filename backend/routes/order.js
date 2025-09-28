const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { Order } = require("../models/order");
const { Product } = require("../models/Products");
const z = require("zod");

const orderSchema = z.object({
  products: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.string().min(1),
    })
  ),
});

// place order

router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { success, data, error } = orderSchema.safeParse(req.body);
    if (!success)
      return res.status(400).json({ message: error.errors[0].message });

    let totalPrice = 0;
    for (let item of data.products) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });
      totalPrice += product.price * item.quantity;
    }
    const newOrder = await Order.create({
      user: req.userId,
      products: data.products,
      totalPrice,
      status: "Pending",
      statusHistory: [{ status: "Pending", date: new Date() }],
    });
    return res.json({ message: "Order placed successfully", order: newOrder });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// get all orderes from user

router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate(
      "products.productId",
      "name price"
    );
    return res.json(orders);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// get single order

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.find({
      _id: req.params.id,
      user: req.userId,
    }).populate("products.productId", "name price");
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json(order);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// Status validation schema
const statusSchema = z.object({
  status: z.enum(["Pending", "Shipped", "Delivered", "Cancelled"]),
});

router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    // Validate request body
    const { success, data, error } = statusSchema.safeParse(req.body);
    if (!success)
      return res.status(400).json({ message: error.errors[0].message });

    // Find order and update status
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: data.status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated", order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = status;
    order.statusHistory.push({ status, date: new Date() });
    await order.save();
    res.json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
