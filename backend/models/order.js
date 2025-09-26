const mongoose = require('../db')
const User = require('./User');
const Prodcuts = require('./Products')

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Products',
                required:true
            },
            quantity:{
                type:Number,
                default:1
            }
        }
    ],
    totalPrice:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:'Pending'
    }
}
)

module.exports = mongoose.model("Order", orderSchema);