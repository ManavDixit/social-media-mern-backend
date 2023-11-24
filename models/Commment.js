import mongoose from "mongoose";

const CommentsSchema=mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    likes:{
        type:Array,
        default:[]
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:String
    },
    post:{
        type:mongoose.Types.ObjectId
    }
});
const CommentsModel=mongoose.model("Comment",CommentsSchema);
export default CommentsModel; 