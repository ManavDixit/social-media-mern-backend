import mongoose from "mongoose";
const SignupSchema = mongoose.Schema({
    name: { type: String, required: true },
    email:{type:String,required:true},
    password:{type:String,required:false,default:''},
    picture:{type:String,default:null},
    followers:{type:Array,default:[]},
    following:{type:Array,default:[]},
    pfp:{type:String,default:null}
});
const model=mongoose.model('user',SignupSchema);
export default model;
