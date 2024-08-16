const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");


const listingController = require ("../controller/user.js");

router.get("/signup",listingController.renderSignUpForm);


router.post("/signup" , wrapAsync (listingController.SignUp));




router.get("/login" ,listingController.login);

router.post("/login",passport.authenticate("local" ,{failureRedirect:"/login" , failureFlash :"true"}), wrapAsync (async(req,res)=>{
    req.flash("success" ,"welcome to wanderlust  you loggedin Successfully !");
    res.redirect("/listings");
 }));


router.get("/logout" ,listingController.logout );

 











module.exports = router;