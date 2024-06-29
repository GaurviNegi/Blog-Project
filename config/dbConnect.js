const mongoose = require("mongoose");

//setting connection 
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("mongodb connected successfully......");
    } catch (error) {
        console.log("failed to connect",error.message);
    }
}

connectDB();
