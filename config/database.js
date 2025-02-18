const mongoose = require("mongoose");

const DB = process.env.MONGODB_URI

mongoose.connect(DB)
.then(() => {
    console.log("connection to database successful");
    
})
.catch((Error) => {
    console.log("error connecting to database" + Error.message);
    
})