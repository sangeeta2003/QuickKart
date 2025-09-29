const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const  Order  = require("../models/order");
const  Product  = require("../models/Products");
const z = require("zod");

// Validation schema
const orderSchema = z.object({
  products: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().min(1), 
    })
  ),
});


const statusSchema = z.object({
  status: z.enum(["Pending", "Shipped", "Delivered", "Cancelled"]),
});

//  Place order
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const parsed = orderSchema.safeParse(req.body);
if (!parsed.success) {
  return res.status(400).json({ message: parsed.error.errors[0].message });
}


    const data = parsed.data;
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

//  Get all orders for logged-in user
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

//  Get single order
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
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

// Update order status + push history
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const parsed = statusSchema.safeParse(req.body);
if (!parsed.success) {
  const firstError = parsed.error.errors?.[0]?.message || "Invalid input";
  return res.status(400).json({ message: firstError });
}

    const { status } = parsed.data;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.statusHistory.push({ status, date: new Date() });
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
