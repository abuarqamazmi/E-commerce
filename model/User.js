const { number } = require('joi');
const mongoose=require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema=mongoose.Schema({

    // username passport dega
    // password passport dega

    email:{
        type:String,
        trim:true,
        required:true
    },
    gender:{
        type:String,
        trim:true,
        required:true
    },
   role:{
        type:String,
        default:'buyer'
   },
    wishlist:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        },
    ],
    cart: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        }
      ]
});

userSchema.plugin(passportLocalMongoose); //always apply on schema

let User=mongoose.model('User',userSchema);

module.exports=User;

