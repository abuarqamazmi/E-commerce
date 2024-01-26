const express=require('express');
const Product = require('../model/Product');
const Review = require('../model/Review');
const User = require('../model/User');
const { validateProduct,isLoggedIn,isSeller,isProductAuthor } = require('../middleware');
const router=express.Router();

router.get('/products',async(req,res)=>{
    try{
        let products=await Product.find({});
        res.render('index',{products}); 
    }catch(e){
        res.render('error',{err:e.message});
    }

});


router.get('/products/new',isLoggedIn,isSeller,(req,res)=>{
    try{
        res.render('new');
    }
    catch(e)
    {
        res.render('error',{err:e.message});
    }

});

router.post('/products',isLoggedIn,isSeller,validateProduct,async(req,res)=>{
    try{
        let {name,img,price,desc}=req.body;

        await Product.create({name,img,price,desc,author:req.user._id});

        req.flash('success' , 'Product added successfully');
        res.redirect('/products');
    }catch(e){
        res.render('error',{err:e.message});
    }
   
});

router.get('/products/:id',isLoggedIn,async(req,res)=>{
    try{
        let {id}=req.params;
        let user=req.user;
        let foundProduct=await Product.findById(id).populate('reviews');
        res.render('show',{foundProduct,user});
    }
    catch(e)
    {
        res.render('error',{err:e.message});
    }

});

router.get('/products/:id/edit',isLoggedIn,isSeller,async(req,res)=>{
    try{    
        let {id}=req.params;
        let foundProduct=await Product.findById(id);
        res.render('edit',{foundProduct});
    }
    catch(e)
    {
        res.render('error',{err:e.message});
    }

});

router.patch('/products/:id',isSeller,isLoggedIn,isProductAuthor,async(req,res)=>{
    try{
        let {id}=req.params;
        let{name,img,price,desc}=req.body;
        await Product.findByIdAndUpdate(id,{name,img,price,desc});
        res.redirect('/products');
    }
    catch(e)
    {
        res.render('error',{err:e.message});
    }

});

router.delete('/products/:id',isSeller,isLoggedIn,isProductAuthor,async(req,res)=>{
    try{
        let {id}=req.params;
        let foundProduct=await Product.findById(id);
        for(let ids of foundProduct.reviews){
        await  Review.findByIdAndDelete(ids);
        }

        await Product.findByIdAndDelete(id);
        const user=req.user;
        await User.updateMany({}, { $pull: { cart: id } });
        await User.updateMany({}, { $pull: { wishlist: id } });
        res.redirect('/products');
    }
    catch(e)
    {
        res.render('error',{err:e.message});
    }

});


module.exports=router;