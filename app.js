if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");

const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing.js");
const Review = require("./Models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const{listingSchema , reviewSchema} = require("./schema.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");



const session = require("express-session");
const MongoStore = require('connect-mongo');
 const flash = require ("connect-flash");
 const passport = require ("passport");
 const localStrategy = require("passport-local");
 const User = require("./Models/user.js");
 
 




// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbURL=process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); 




const store =  MongoStore.create({
  mongoUrl: dbURL, 
  crypto: {
      secret: process.env.SECRET,
    },
    touchAfter : 24*3600,
    
});

store.on("error" , ()=>{
  console.log("Error in mongo session store" , err);
});


const sessionOptions = {
    store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie :{
      expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge :7 * 24 * 60 * 60 * 1000,
      httpOnly :true,
  }

};



app.use (session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());



passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());







app.use((req ,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser" ,async(req,res)=>{
//     let fakeuser = new User({
//         email : "rajat@gmail.com",
//         username : "rajat"
//     });

//    let user = await User.register(fakeuser,"helloworld");
//    res.send(user);

// });

// app.get('/dashboard', (req, res) => {
//   if (req.isAuthenticated()) {
//       console.log('User is authenticated:', req.user);
//       res.send('Welcome, ' + req.user.username);
//   } else {
//       res.redirect('/login');
//   }
// });


app.use ("/listings", listings);

app.use ("/listings/:id/reviews" , reviews);

app.use ("/", userRouter);

// const validateListing = (req,res,next) =>{
//   let {error}= listingSchema.validate(req.body)

//   if(error){
//     throw new ExpressError(400 ,error);
//   } else{
//     next();
//   }
// };




//  to check listing by entering manual entry in collection
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.use((err,req,res,next)=>{
  let{statusCode =500, message="Something went wrong!"} = err;
  res.render("error.ejs",{message});
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
