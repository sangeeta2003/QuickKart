// backend/user/index.js
const express = require('express');
const userRouter = require("./user");
const productRouter = require('./Products')
const orderRouter = require('./order');


const router = express.Router();

router.use("/user", userRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);

module.exports = router;