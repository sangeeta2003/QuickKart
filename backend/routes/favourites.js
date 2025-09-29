const express = require('express');
const router = express.Router();
const  {authMiddleware}  = require('../middleware/authMiddleware');
const User = require('../models/User');
const Product = require('../models/Products');

// GET: Get all favorite products
router.get('/favorites', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('favourites');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ favourites: user.favourites });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Server error" });
    }
});

// POST: Add a product to favorites
router.post('/favorites/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (!user.favourites.includes(productId)) {
            user.favourites.push(productId);
            await user.save();
        }

        return res.json({ message: "Product added to favorites", favourites: user.favourites });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Server error" });
    }
});

// DELETE: Remove a product from favorites
router.delete('/favorites/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.favourites = user.favourites.filter(id => id.toString() !== productId);
        await user.save();

        return res.json({ message: "Product removed from favorites", favourites: user.favourites });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

// 68da068c12ced342a0a7aaa2
