const mongoose = require('../db')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
       
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        default:0
    },
    image:{
type:String
    }
},
{timestamps:true}
);

module.exports = mongoose.model('Prodcuts',productSchema)