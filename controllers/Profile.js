import Users from "../models/Auth.js";
import Posts from "../models/Post.js";
export const getProfileData=async (req,res)=>{
    try {
        const email=req.email;
        //checking if user exists
        const {user_email}=req.query;
        console.log(user_email)
        const user=user_email?await Users.findOne({email:user_email}):await Users.findOne({email});
        console.log(user)
        if(!user) return res.status(404).send({success:false,error:'user not found'});
        //getting user post
        let posts=await Posts.find({user:user_email||email});
        
        if (posts){posts=await Promise.all(posts.map(async post =>({
            ...post.toObject(),likes:post?.likes?.length,hasLiked:post?.likes?.includes(email),user:(await Users.findOne({email:post.user}))?.name,email:post.user
          })));}

        console.log(posts);
        const isMyProfile=user_email?user_email===email:true;
        if(user_email){
          const authenticatedUser=await Users.findOne({email});
            const followers=await Promise.all(user.followers.map(async (follower)=>{return {email:follower,user:(await Users.findOne({email:follower}))?.name,isFollowing:authenticatedUser.following.includes(follower) }}));

            const following=await Promise.all(user.following.map(async (followedBy)=>{return {email:followedBy,user:(await Users.findOne({email:followedBy}))?.name,isFollowing:authenticatedUser.following.includes(followedBy) }}));

            res.status(200).send({success:true,user:{name:user.name,email:user.email,followers,following,pfp:user.pfp,posts,isMyProfile,isFollowing:user.followers.includes(email)}});
        }else{
            res.status(200).send({success:true,user:{name:user.name,email:user.email,pfp:user.pfp,isMyProfile}});

        }
    } catch (error) {
        console.log(error);
        res.status(500).send({success:false,error:error.message})
    }
    
}
export const followUser=async(req,res)=>{
    const {user_email}=req.query;
  const {email}=req;//set by authenticate middleware
  try {
    const user=await Users.findOne({email:user_email});
    const user_that_wants_to_follow=await Users.findOne({email})
    //checking if user is not following itself
    if(user_email===email) return res.status(400).send({success:false,error:'cant follow yourself'});
    //checking if user exist
    if(!user) return res.status(400).send({success:false,error:'user does not exist'});
    //checking if already following user
    if(user.followers.includes(email)){
    //removing from followers
      let followers=user.followers.filter((follower)=>{return follower!==email});
      await Users.findOneAndUpdate({email:user_email},{followers},{new:true});
      
      //removing from following 
      let following=user_that_wants_to_follow.following.filter((followedBY)=>{return followedBY!==user_email});
      await Users.findOneAndUpdate({email:email},{following},{new:true});
      res.status(200).send({success:true,type:'unfollowed'})
    }else{
    //adding user that wants to follow to the followers of user
      await Users.findOneAndUpdate({email:user_email},{followers:[...user.followers,email]},{new:true});
    //adding user to following of user that wants to follow
      await Users.findOneAndUpdate({email:email},{following:[...user_that_wants_to_follow.following,user_email]},{new:true});
      res.status(200).send({success:true,type:'followed'})
    }
    
  } catch (error) {
    console.log(error)
    return res.status(400).send({success:false,error:error.message});
  }
}