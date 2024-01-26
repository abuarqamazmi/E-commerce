const express=require('express');
const app=express();
const path=require('path');
const productroute=require('./routes/product');
const reviewroute=require('./routes/review');
const mongoose = require('mongoose');
const seedDb = require('./seed');
const methodOverride = require('method-override')
const session=require('express-session');
const flash=require('connect-flash');
const authroute=require('./routes/auth');
const productApi=require('./routes/api/productApi');
const passport = require('passport'); //pass
const LocalStrategy = require('passport-local'); //pass
const User = require('./model/User'); //pass
const cartRoutes=require('./routes/cart');
const dotenv=require('dotenv').config();
mongoose.set('strictQuery', true);
const uri=process.env.ATLAS_URL;
mongoose.connect(uri)
.then(()=>{
    console.log("DB is connected...");
})
.catch((err)=>{
    console.log("error occoured .."+err);
});


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));
// seedDb();

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));

// app.use((req,res)=>{
//     res.send("Your server is working ...");
// });

// app.use(express.urlencoded({extended:true})) //form data body parser

let configSession = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true , 
        expires : Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000
    }
}

app.use(session(configSession));
app.use(flash());


// use static serialize and deserialize of model for passport session support
app.use(passport.initialize()); //pass
app.use(passport.session()); //pass
passport.serializeUser(User.serializeUser()); //pass
passport.deserializeUser(User.deserializeUser()); //pass

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate())); //pass


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get("/",(req,res)=>{
    res.render('home');
});

app.use(productroute);
app.use(reviewroute);
app.use(authroute);
app.use(productApi);
app.use(cartRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`server is working....${process.env.PORT}`);
});