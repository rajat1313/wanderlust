const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");


const listingController = require ("../controller/user.js");

router.get("/signup",listingController.renderSignUpForm);


router.post("/signup" , wrapAsync (listingController.SignUp));




router.get("/login" ,listingController.login);

router.post("/login",passport.authenticate("local" ,{failureRedirect:"/login" , failureFlash :"true"}),(req,res)=>{
    req.flash("success" ,"Welcome");
    res.redirect("/listings");
 });


//  router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
//     console.log(req.user);  // This should log the user if authentication was successful
//     req.flash("success" ,"welcome to wanderlust  you loggedin Successfully !")
//     res.redirect('/listiing');
// });


router.get("/logout" ,listingController.logout );

 











module.exports = router;