const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./modals/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 
const wrapAsync = require("./utils/wrapAsysnc.js");
const ExpressError = require("./utils/ExpressError.js");

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
app.get("/listings", wrapAsync (async (req,res)=>{
   let allListings = await Listing.find({});
   res.render("listings/index.ejs",{allListings});
}));

// create route (showing)
app.get("/listings/new",(req,res)=>{
res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id",wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

// create route(creating)
app.post("/listings", wrapAsync(async(req,res,next)=>{
// if(!req.body.Listing){
//     throw new ExpressError(400,"please send valid data for listing")
// }

const newListing = new Listing(req.body.listing);
 await newListing.save();
 res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
     let { id } = req.params; 
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//update route
app.put("/listings/:id" , wrapAsync(async(req,res)=>{
let {id} =req.params;
 await Listing.findByIdAndUpdate(id,{...req.body.listing });
 res.redirect(`/listings/${id}`);
}));

// delete route
app.delete("/listings/:id" , wrapAsync( async(req,res)=>{
let {id} =req.params;
 await Listing.findByIdAndDelete(id);
 res.redirect("/listings");
}));

app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError(404,"PAGE NOT FOUND!"));  
});

//ushing a middelewere for errror handeling => when we pass price as a string instead a number then a error may occure so
app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Something went wrong!"} = err; 
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs",{message})
});

