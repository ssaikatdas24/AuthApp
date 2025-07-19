const mongoose = require('mongoose');
require('dotenv').config();

exports.connect =()=>{
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log("DB connection successful")
    })
    .catch((err)=>{
        console.error("DB connection error: ", err);
        process.exit(1); // Exit the process with failure
    })
}