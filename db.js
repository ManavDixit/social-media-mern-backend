import dotenv from "dotenv";
dotenv.config()
import mongoose from "mongoose";
const url=process.env.DB_URL;

//const url="mongodb://localhost:27017"
const connectToDataBase=()=>{
    mongoose.connect(url).then(()=>{
	    console.log("connected successfuly");
    }).catch((error)=>{
	    console.log(error);
    });
}
export default connectToDataBase;
