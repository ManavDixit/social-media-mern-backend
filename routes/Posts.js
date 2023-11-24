import express from "express";
import { upload } from "../middleware/Posts.js";
const Router=express.Router()
import {getAllPost,CreateNewPost,likePost,getPostInfo} from '../controllers/Posts.js'
import {authenticate} from '../middleware/auth.js';
import paginate from '../middleware/pagination.js'
import Posts from "../models/Post.js";
import Comments from '../models/Commment.js';
import { addComment, getComments, likeComment } from "../controllers/Comments.js";
//route to fetch all post
Router.get('/',authenticate,(req,res,next)=>{req.options={};next()},paginate(Posts),getAllPost);
//route to crete a new post
Router.post('/createpost',authenticate,upload.single('attachment'),CreateNewPost);
Router.get('/likePost',authenticate,likePost);
Router.get('/getPostInfo',authenticate,getPostInfo);
Router.post('/addcomment',authenticate,addComment);
Router.get('/getcomments',authenticate,(req,res,next)=>{req.options={post:req.headers.post_id};next()},paginate(Comments),getComments);
Router.get('/likecomment',authenticate,likeComment);

//route for images
// Router.get('/image',getImage)
export default Router;