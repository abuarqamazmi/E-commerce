const express=require('express');
const { isLoggedIn } = require('../middleware');
const Product = require('../model/Product');
const User = require('../model/User');
const router=express.Router();
const stripe = require('stripe')('sk_test_51Ock85SDMBdNQps4P2QAzoPwhjm38sRYHlzbzQjEV8avX8LmvuAYiF3Dc4f0jSt1vatiFpcB9j4qH1btSwgnNHun00Iti72N1Y')


router.get("/user/cart",isLoggedIn,async(req,res)=>{
    let userId=req.user._id;
    let user=await User.findById(userId).populate("cart");
    let totalAmount=user.cart.reduce((sum,curr)=> sum+curr.price,0);
    res.render("cart",{user,totalAmount});
});

router.post("/user/:productId/add",isLoggedIn,async (req,res)=>{
    let {productId}=req.params;
    let userId=req.user._id;

    let product=await Product.findById(productId);
    let user=await User.findById(userId);

    var present=false;
    for(let id of user.cart){
      if(id.equals(productId)){
        present=true;
      }
    } 
    console.log(present) ;

    if(!present)
    {
        user.cart.push(product);

        await user.save();
    }


    res.redirect('/user/cart');

});

router.get('/checkout',isLoggedIn,async (req, res) => {
  let userId=req.user._id;
  let user=await User.findById(userId).populate("cart");
  let totalAmount=user.cart.reduce((sum,curr)=> sum+curr.price,0);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: totalAmount*100,
        },
        quantity: user.cart.length,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:4242/success',
    cancel_url: 'http://localhost:4242/cancel',
  });

  res.redirect(303, session.url);
});


module.exports=router;