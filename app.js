const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./modals/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs',ejsMate);
app.listen(8080,()=>{
    console.log("the server is listening to the port 8080");
});
// to connect the databases
let mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';
async function main() {
    await mongoose.connect(mongo_url);
}
//calling the main function
main()
.then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
console.log(err);
});
app.get("/",(req,res)=>{
    res.render("listings/home.ejs")
});
app.get("/testListing", async(req,res)=>{
      let sampleListing = new Listing({
        title: "my new villa",
        description: "By the beach",
        price: "1200",
        location: "calungute,goa",
        country:"india",

      });
       await sampleListing.save();
       console.log("sample was saved")
       res.send("successfull testing"); 
})
// listings
app.get("/listings", async (req,res)=>{
   let allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
});

// create route (showing)
app.get("/listings/new",(req,res)=>{
res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// create route(creating)
app.post("/listings", async(req,res)=>{
// let{title,description,image,price,location,country} = req.body; 
 const newListing = new Listing(req.body.listing);
 await newListing.save();
 console.log(newListing);
 res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit",async (req,res)=>{
     let { id } = req.params; 
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
})

//update route
app.put("/listings/:id" , async(req,res)=>{
let {id} =req.params;
 await Listing.findByIdAndUpdate(id,{...req.body.listing });
 res.redirect(`/listings/${id}`);
});

// delete route
app.delete("/listings/:id" , async(req,res)=>{
let {id} =req.params;
 await Listing.findByIdAndDelete(id);
 res.redirect("/listings");
});