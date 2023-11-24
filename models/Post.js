import mongoose from "mongoose";

const PostSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:null
    },
    video:{
        type:String,
        default:null
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
});
const PostsModel=mongoose.model("Post",PostSchema);
export default PostsModel; 