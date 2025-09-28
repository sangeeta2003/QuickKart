const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { User } = require('../models/User');
const { Product } = require('../models/Products');

// get favourites products

router.get('/favorites',authMiddleware,async(req,res)=>{
    try{
        const user = await User.findById(req.userId).populate('favourites');
        return res.json({favourites : user.favourites});


    }catch(e){
        console.error(e);
        return res.status(500).json({ message: "Server error" });
    }

})


// add prodctus to favourite

router.post('/favorites/:productId',authMiddleware,async(req,res)=>{
    try{

        const productId = req.params.productId;
        const user = await User.findById(req.userId);
        if(!user.favourites.include(productId)){
            user.favourites.push(productId);
            await user.save();
        }
        return res.json({ message: "Product added to favorites", favourites: user.favourites });

    }catch(e){
        console.error(e);
        return res.status(500).json({ message: "Server error" });
    }
})


// delete the prodcut from favourite

router.delete('/favorites/:productId',authMiddleware,async(req,res)=>{
    try{
        const productId = req.params.productId;
        const user = await User.findById(req.userId);
        user.favourites = user.favourites.filter(id => id.toString() !== productId);
        await user.save();
        return res.json({ message: "Product removed from favorites", favorites: user.favorites });

    }catch(e){
        console.error(e);
        return res.status(500).json({ message: "Server error" });
    }
})
module.exports = router;