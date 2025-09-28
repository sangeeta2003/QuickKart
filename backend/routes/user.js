const express = require('express');
const router = express.Router();
const z = require('zod');
const  User = require('../models/User');
const { JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Signup schema
const signupSchema = z.object({
    name: z.string().min(1),
    phone: z.string().length(10),
    password: z.string().min(6)
});

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { success, data, error } = signupSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: error.errors[0].message });
        }

        const existingUser = await User.findOne({ phone: data.phone });
        if (existingUser) {
            return res.status(400).json({ message: "Phone already taken / Incorrect inputs" });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = await User.create({
            name: data.name,
            phone: data.phone,
            password: hashedPassword
        });

        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

        return res.json({
            message: "User created successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                phone: newUser.phone
            }
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Server error" });
    }
});

// Signin schema
const signinSchema = z.object({
    phone: z.string().length(10),
    password: z.string().min(6)
});

// Signin route
router.post('/signin', async (req, res) => {
    try {
        const { success, data, error } = signinSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: error.errors[0].message });
        }

        const user = await User.findOne({ phone: data.phone });
        if (!user) {
            return res.status(400).json({ message: "Invalid phone or password" });
        }

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid phone or password" });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        return res.json({ token });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGQ5NDQyZGU4MDAxMzNiZTdlNjUwZTMiLCJpYXQiOjE3NTkwNjkyMjksImV4cCI6MTc1OTY3NDAyOX0.la8UxfWcSH5xxi3WUmYDzxxzU6U4HJ3kEfMwLrlNA74
