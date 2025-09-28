const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order (trial)
router.post('/create-payment', async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt = 'receipt#1' } = req.body;

        const options = {
            amount: amount * 100, 
            currency,
            receipt
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
