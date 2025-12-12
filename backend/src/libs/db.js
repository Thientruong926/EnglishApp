import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("Success connect to DB");
    }
    catch (error){
        console.log("Fail to connect DB");
        process.exit(1);
    }
} ;