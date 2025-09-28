const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Product = require('../models/Products');
const z = require('zod');

const cartSchema = z.object({
    productId : z.string().min(1),
quantity:z.number().min(1)
})

// add to cart

router.post('/add',authMiddleware,async(req,res)=>{
    try{

        const{success,data,error} = cartSchema.safeParse(req.body);
        if (!success) return res.status(400).json({ message: error.errors[0].message });

        const user = await User.findById(req.userId);
        const existingItemIndex = user.cart.findIndex(item => item.productId.toString() === data.productId);
        if(existingItemIndex !== -1){
            user.cart[existingItemIndex].quantity += data.quantity;
        }else{
            user.cart.push(data);
        }
         await user.save();
        res.json({ message: "Cart updated successfully", cart: user.cart });



    }catch(e){
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
})


// remove products

router.delete('/remove/:productId',authMiddleware,async(req,res)=>{
try{

    const user = await User.findById(req.userId);
    user.cart = user.cart.filter(item => item.productId.toString() !== req.params.productId);
    await user.save();
    res.json({ message: "Product removed from cart", cart: user.cart });

}catch(e){
    console.error(e);
        res.status(500).json({ message: "Server error" });
}
})

// get users cart

router.get('/',authMiddleware,async(req,res)=>{
    try {
        const user = await User.findById(req.userId).populate('cart.productId', 'name price image');
        res.json({ cart: user.cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
})

module.exports = router;
