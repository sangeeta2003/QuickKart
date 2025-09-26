const express = require('express');
const router = express.Router();

const z = require('zod');

const {User} = require('../models/User');

const { JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// signup

const signupSchema = z.object({
    name:z.string().min(1),
    phone:z.string().length(10),
    password:z.string().min(6)
})


router.post('/signup',async(req,res)=>{

    try{
        
    const {success , data , error} = signupSchema.safeParse(req.body);
    if(!success){
        return res.json({
            message:'Email already taken / Incorrect inputs'
        });

    }
    const existingUser = await User.findOne({
        
        phone:data.phone
    })
    if(existingUser){
        return res.json({
            message:"Email already taken / Incorrect inputs"
        });
    }

        const hashedPassowrd = await bcrypt.hash(data.password,10);

        const newUser = await User.create({
            name:data.name,
            phone:data.phone,
            password:hashedPassowrd
        });

        const token = jwt.sign({
            userId : newUser._id
 },JWT_SECRET, {expiresIn:'7d'})
return res.json({
            message:"User created successfully",
            token:token,
 user: {
                id: newUser._id,
                name: newUser.name,
                phone: newUser.phone
            }
        });
        
    }catch(e){
console.error(e);
        return res.status(500).json({ message: "Server error" });
    }
    

    
    
})


// signin 

const signInbody = z.object({
    name:z.string(),
    password:z.string().min(6),
    phone : z.string().length(10)

})
router.post('/signin',async(req,res) =>{
    try{

        const{success,data,error} = signInbody.parse(req.body);
        if(!success){
            return res.status(411).json({
    message:"Incorrect inputs"
})
        }

        const user = await User.findOne({
            phone:data.phone
        });

        if(!user){
            return res.status(400).json({ message: "Invalid phone or password" });
        }
 const isMatch = await bcrypt.compare(hashedPassowrd,user.password);
 if (!isMatch) {
            return res.status(400).json({ message: "Invalid phone or password" });
        }

        if(user){
        const token =jwt.sign({
            userId:user._id
        },JWT_SECRET,{expiresIn:'7d'})
        res.json({
            token:token
        })
        }
        
res.status(411).json({
    message:'Error whole logged in'
})
    }catch(e){
console.error(e);
        return res.status(500).json({ message: "Server error" });
    }
})
module.exports = router;