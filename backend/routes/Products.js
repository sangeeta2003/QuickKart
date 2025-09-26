const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { Product } = require('../models/Products');
const z = require('zod');

const ProductSchema = z.object({
    name:z.string().min(1),
    description:z.string().optional(),
    price:z.number().min(0),
    quantity:z.number().min(0),
    image:z.string().url().optional()

});

// get all Products

router.get('/',async(req,res)=>{
    try{
        const products = await Product.find();
        return res.json(products);

    }catch(e){
console.error(e);
        return res.status(500).json({ message: "Server error" });
    }
})


// add new products

router.post('/add',authMiddleware,async(req,res)=>{
try{

    const{success,error,data} = ProductSchema.safeParse(req.body);
    if(!success){
        return res.status(400).json({ message: error.errors[0].message });
    }
    const newProduct = await Product.create(data);
     return res.json({ message: "Product added successfully", product: newProduct });


}catch(e){
console.error(e);
        return res.status(500).json({ message: "Server error" });
}
})


// update products
router.put('/:id',authMiddleware,async(req,res)=>{

    try{
        const{success,error,data} = ProductSchema.partial().safeParse(req.body);
        if(!success){
            return res.status(400).json({ message: error.errors[0].message });
        }
        const updateProducts = await Product.findByIdAndUpdate(req.params.id,data,{ new: true });
        if(!updateProducts){
            return res.status(404).json({ message: "Product not found" });
        }
        return res.json({ message: "Product updated successfully", product: updateProducts });

    }catch(e){
console.error(e);
        return res.status(500).json({ message: "Server error" });
    }
})

// delete
router.delete('/:id',authMiddleware,async(req,res)=>{

    try{
const deletedProdcut = await Product.findByIdAndDelete(req.params.id);
if (!deletedProdcut) return res.status(404).json({ message: "Product not found" });

        return res.json({ message: "Product deleted successfully" });
    }catch(e){
console.error(e);
        return res.status(500).json({ message: "Server error" });
    }
})
module.exports = router;