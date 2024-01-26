const mongoose=require('mongoose');
const Review = require('./Review');

const {Schema} =mongoose;


const productschema=new Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    img:{
        type:String,
        trim:true
    },
    price:{
        type:Number,
        min:0,
        required:true
    },
    desc:{
        type:String,
        trim:true
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    quantity:{
        type:Number,
        default:1,
    }
});

let Product=mongoose.model('Product',productschema);

module.exports=Product;