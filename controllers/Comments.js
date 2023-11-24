import Posts from "../models/Post.js";
import Users from "../models/Auth.js";
import Comments from '../models/Commment.js';
//function to add comment to a post
export const addComment = async (req, res) => {
  try {
    const { post_id, message } = req.headers;

    //checking if message exist
    if (!message)
      return res
        .status(404)
        .send({ success: false, error: "comment must not be blank" });

    // checking if post exists
    const post = await Posts.findById(post_id);
    if (!post)
      return res.status(404).send({ success: false, error: "Post not found" });

    //Adding Comment
    const comment=new Comments({user:req.email,post:post_id,message:message})
    const savedComment=await comment.save()
    res.status(200).send({ success: true });
  } catch (error) {
    console.log(error)
    res.status(404).send({ success: false, error:error.message });
  }
};


//function to get comments of a post
export const getComments=async (req,res)=>{
    try {
        const { post_id } = req.headers;
        const {email}=req;
        console.log('post id is ',post_id)
    // checking if post exists
    const post = await Posts.findById(post_id);
    if (!post)
      return res.status(404).send({ success: false, error: "Post not found" });
    
    
      // getting paginated data
    let comments=req.paginatedData;
    let isPrevAvialble=req.isPrevAvialble
    let isNextAvailable=req.isNextAvailable
    console.log(comments);

    
      if (comments){comments=await Promise.all(comments.map(async comment =>({
        ...comment.toObject(),user:(await Users.findOne({email:comment.user}))?.name,hasLiked:comment?.likes?.includes(email)
      })));}
      res.status(200).send({success:true,comments,isNextAvailable,isPrevAvialble})

    } catch (error) {
        console.log(error);
        res.status(404).send({ success: false, error:error.message });
    }
}

//function to like a commment

export const likeComment=async (req,res)=>{
  const {postid,commentid}=req.headers;
  const {email}=req;//set by authenticate middleware
  try {
    const post=await Posts.findById(postid);
    //checking if post exist
    if(!post) return res.status(400).send({success:false,error:'post does not exist'});
    const comment=await Comments.findById(commentid);
    //checking if comment exist
    if(!comment) return res.status(400).send({success:false,error:'comment does not exist'});

    //checking if user already liked post
    if(comment.likes.includes(email)){
      let likes=comment.likes.filter((user)=>{console.log(user!==email);return user!==email});
      const newcomment=await Comments.findByIdAndUpdate(commentid,{likes},{new:true});//new:true to returtn updated coment
      res.status(200).send({success:true})
    }else{
      const newcomment=await Comments.findByIdAndUpdate(commentid,{likes:[...comment.likes,email]},{new:true});//new:true to returtn updated post
      res.status(200).send({success:true})
    }
    
  } catch (error) {
    console.log(error)
    return res.status(400).send({success:false,error});
  }
}