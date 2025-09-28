
const express = require('express');
const userRouter = require("./user");
const productRouter = require('./Products')
const orderRouter = require('./order');
const favoritesRouter = require('./favourites');
const cartRouter = require('./Cart');
const paymentRouter = require('./Payments');


const router = express.Router();

router.use("/user", userRouter);
router.use("/products", productRouter);
router.use("/orders", orderRouter);
router.use('/favorites', favoritesRouter);
router.use('/cart', cartRouter);
router.use('/payment', paymentRouter);



module.exports = router;

