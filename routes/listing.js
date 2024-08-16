const express = require ("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const{listingSchema , reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const {isLoggedIn , isOwner}= require("../middleware.js");

const listingController = require ("../controller/listing.js");


const multer  = require('multer');
const {storage } = require("../cloudconfig.js");
const upload = multer({ storage });



//Index Route 111
router.get("/",wrapAsync(listingController.index) );
  
  //New Route
  router.get("/new",isLoggedIn,listingController.renderNewForm );
  
  //Create Route
  router.post("/",isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.createListing));
  
  
  //Show Route
  router.get("/:id",isLoggedIn, wrapAsync(listingController.showlisting));
  
  router.post("/",  upload.single("listing[image]"),  async(req, res, ) =>{
    let url = req.file.path;
    let filename = req.file.filename;

   
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url ,filename};

    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");

    
    res.send(req.file);
});
  
  //Edit Route
  router.get("/:id/edit",isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingController.editListing ));
  
  //Update Route
  router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync( listingController.updateListing));
  
  //Delete Route
  router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));
  

  module.exports = router;