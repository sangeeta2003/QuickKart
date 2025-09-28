const { Mongoose } = require('mongoose');
const mongoose = require('../db')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    favourites:[
    {
         type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
    }
],
cart:[
    {
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
        },
        quantity:{
            type:Number,
            default:1
        }
    }
]


}


)
module.exports = mongoose.model("User", userSchema);