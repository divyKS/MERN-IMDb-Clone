const mongoose = require('mongoose');
require('dotenv').config();
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{console.log("DB connection successful")})
    .catch((error)=>{console.log("DB connection failed: ", error)});