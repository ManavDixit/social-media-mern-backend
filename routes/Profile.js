import express from 'express';
import {getProfileData,followUser}  from '../controllers/Profile.js';
import {authenticate} from '../middleware/auth.js';
const Router=express.Router();
Router.get('/',authenticate,getProfileData)
Router.get('/follow',authenticate,followUser)
export default Router;