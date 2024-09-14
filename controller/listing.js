const Listing = require("../Models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/tilesets');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index Route 111

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listing/index.ejs", { allListings });
};

//New Route

module.exports.renderNewForm = (req, res) => {

  res.render("listing/new.ejs");
  
};

//show Route

module.exports.showlisting = (async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listing");
  } console.log(listing);
  console.log(req.user);
  res.render("listing/show.ejs", { listing });
});


//Create Route

module.exports.createListing = async (req, res, next) => {

  // const response = await geocodingClient.forwardGeocode({
  //   query: req.body.listing.location,
  //   limit: 1
  // })
  //   .send()
  //   console.log(response.body.features[0].geometry);
  //   res.send("done!");


  let url = req.file.path;
  let filename = req.file.filename;

  // listingSchema.validate(req.body);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

//Edit Route
module.exports.editListing = async (req, res) => {

  let { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success", "Listing Edited!");
  res.render("listing/edit.ejs", { listing });
};

//Update Route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });


  let url = req.file.path;
  let filename = req.file.filename;
  if (typeof req.file !== "undefined") {

    listing.image = { url, filename };
    await listing.save();
    req.flash("success", " Listing updated!");
    res.redirect(`/listings/${id}`);
  }

};

//Delete Route

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  console.log(deletedListing);
  res.redirect("/listings");
};