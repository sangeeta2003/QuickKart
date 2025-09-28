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
    },
    reviews :[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            rating:{
                type:Number,
                min:1,
                max:5,
                required:true
            },
            comment:{
                type:String,
                default:""
            },
            date:{
                type:Date,
                default :Date.now
            }
            
        }
    ]
},
{timestamps:true}
);

module.exports = mongoose.model('Prodcuts',productSchema)