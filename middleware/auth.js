import jwt from 'jsonwebtoken';
import Users from "../models/Auth.js";
export const authenticate=async (req,res,next)=>{
    const token=req.headers.token||req.query.token;

    try{
        console.log('token',token)
        if(!token) return res.status(400).send({success:false,error:"authentication error"});
        const email=jwt.verify(token,process.env.JWT_SECRET_KEY);
        console.log(email);
        if(!email) return res.status(400).send({success:false,error:"authentication error"});

        let user = await Users.findOne({ email });
    // checking if user exist
    if (!user) {
      return res.status(400).send({ success: false, error: "user not found" });
    }

        req.email=email;
        next();
    }catch(error){
        console.log(error);
        return res.status(400).send({success:false,error})
    }
}