const express = require ("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");
const{listingSchema , reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const {isLoggedIn , isOwner}= require("../middleware.js");


const listingController = require ("../controller/reviews.js");

const validateReview = (req,res,next) =>{
    let {error}= reviewSchema.validate(req.body)
  
    if(error){
      throw new ExpressError(400 ,error);
    } else{
      next();
    }
  };
  
  

// review
// post
router.post("/" ,isLoggedIn ,wrapAsync(listingController.createReview ));
  
  
  // delete review route
  
  router.delete("/:reviewId",wrapAsync(listingController.destroyReview));
  

  module.exports = router;