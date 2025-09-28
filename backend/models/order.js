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
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default:'Pending'
    },
    statusHistory:[{
status:{
    type:String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
},
    date:{
        type:Date,
        default:Date.now
    }

    }],
    paymentId:{
        type:String
    },
    orderId:{
        type:String
    },
    paymentmethod:{
        type:String
    },
    paymentstatus:{
        type:String,
        enum:['created', 'failed', 'captured'],
        default:'created'
    }
}, { timestamps: true }
)

module.exports = mongoose.model("Order", orderSchema);