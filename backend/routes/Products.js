const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const Product = require('../models/Products');
const z = require('zod');

// Validation schema
const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  quantity: z.number().min(0),
  image: z.string().url().optional(),
});

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// ADD new product (Admin only)
router.post('/add', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { success, error, data } = ProductSchema.safeParse(req.body);
    if (!success) return res.status(400).json({ message: error.errors[0].message });

    const newProduct = await Product.create(data);
    return res.json({ message: "Product added successfully", product: newProduct });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// UPDATE product (Admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { success, error, data } = ProductSchema.partial().safeParse(req.body);
    if (!success) return res.status(400).json({ message: error.errors[0].message });

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    return res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// DELETE product (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    return res.json({ message: "Product deleted successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// SEARCH products
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Query parameter 'q' is required" });

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    }).limit(10);

    return res.json(products);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// ADD a review
router.post('/:productId/reviews', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5)
      return res.status(400).json({ message: "Rating must be between 1 and 5" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find((rev) => rev.userId.toString() === userId.toString());
    if (alreadyReviewed) return res.status(400).json({ message: "You already reviewed this product" });

    product.reviews.push({ userId, rating, comment });
    await product.save();

    res.status(201).json({ success: true, product });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET reviews for a product
router.get('/:productId/reviews', async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate('reviews.userId', 'name');
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ success: true, reviews: product.reviews });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET average rating
router.get('/:productId/rating', async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const totalRatings = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    const avgRating = product.reviews.length ? (totalRatings / product.reviews.length).toFixed(1) : 0;

    res.json({ success: true, averageRating: avgRating, totalReviews: product.reviews.length });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
