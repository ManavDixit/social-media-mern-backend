import Posts from "../models/Post.js";
import Users from "../models/Auth.js";
//function to fetch all post
export const getAllPost = async (req,res) => {
  console.log('get posts')
  try {
    const {email}=req;//set by authenticate middleware
    let posts = req.paginatedData;
    console.log("posts sent");
    //doing ...post.toObject() because spread(...) operator on posts contain some mongodb in ternal non-js proprty
    if (posts){posts=await Promise.all(posts.map(async post =>({
      ...post.toObject(),likes:post?.likes?.length,hasLiked:post?.likes?.includes(email),user:(await Users.findOne({email:post.user}))?.name,email:post.user
    })));}
    
    for(let i=0;i<posts.length;i++){
      let randomIndex=Math.floor(Math.random() * posts.length);
      const temp=posts[i];
      posts[i]=posts[randomIndex];
      posts[randomIndex]=temp;
    }
    let isPrevAvialble=req.isPrevAvialble
    let isNextAvailable=req.isNextAvailable
    res.status(200).send({success:true,posts,isNextAvailable,isPrevAvialble});
  } catch (error) {
    console.log(error);
    res.status(400).send({success:false,error})
  }
};
//function to create new note
export const CreateNewPost = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    console.log(req?.file);
    const email=req.email;
    //getting user
    const user=await Users.findOne({email});
    //validating file type

    const type=req?.file?req?.file?.mimetype:'';
    if(req?.file && !type?.startsWith('image') && !type?.startsWith('video')){
      return res.status(400).send({success:false,error:'invalid file type, upload an img or vedio'})
    }

    //adding data to Posts model
    const NewPost =type.startsWith('image')? new Posts({...data,user:email,image:req?.file?.path}) : type.startsWith('video') ?new Posts({...data,user:email,video:req?.file?.path}): new Posts({...data,user:email,image:null,video:null});

    //SAving data to dataBase
    const savedPostNewPost = await NewPost.save();
    //sending savedPost as response
    res.status(200).send({success:true,post:savedPostNewPost});
  } catch (error) {
    console.log(error);
    res.status('400').send({success:false,error:error.message})
  }
};

//function to like a post
export const likePost=async (req,res)=>{
  const {postid}=req.headers;
  const {email}=req;//set by authenticate middleware
  try {
    const post=await Posts.findById(postid);
    //checking if post exist
    if(!post) return res.status(400).send({success:false,error:'post does not exist'});

    //checking if user already liked post
    if(post.likes.includes(email)){
      let likes=post.likes.filter((user)=>{console.log(user!==email);return user!==email});
      const newpost=await Posts.findByIdAndUpdate(postid,{likes},{new:true});//new:true to returtn updated post
      res.status(200).send({success:true})
    }else{
      const newpost=await Posts.findByIdAndUpdate(postid,{likes:[...post.likes,email]},{new:true});//new:true to returtn updated post
      res.status(200).send({success:true})
    }
    
  } catch (error) {
    console.log(error)
    return res.status(400).send({success:false,error});
  }
}

//function to send information about specific post
export const getPostInfo=async (req,res)=>{
  const id=req.query.postid;
  console.log(id);
  const {email}=req;//set by authenticate middleware
  try {
  //check if post exists
  let post=await Posts.findById(id);
  if (!post) return res.status(404).send({success:false,error:'post not found'});
  //setting some values to post
  post={...post.toObject(),likes:post.likes.length,hasLiked:post.likes.includes(email),user:(await Users.findOne({email:post.user})).name,email:post.user}
  res.status(200).send({success:true,post})
} catch (error) {
  console.log(error,'kkkzkk zkzkzkkz');
  res.status(500).send({success:false,error});
}
}