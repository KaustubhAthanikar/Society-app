import mongoose, { connect } from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGODB Connected successfully");
    }catch(err){
        console.log("Error:",err);
        process.exit(1);
    }
}

export default connectDB;