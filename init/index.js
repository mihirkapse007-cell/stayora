const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../modals/listing.js");

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

const initDB = async () =>{
   await Listing.deleteMany({});
   await Listing.insertMany(initData.data);
   console.log("data was initialized");
}

initDB();