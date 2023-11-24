import express from 'express';
import {signUp,signIn,googleAuth, verify} from '../controllers/Auth.js'
const Router=express.Router();
Router.post('/signup',signUp);
Router.post('/signin',signIn);
Router.post('/google',googleAuth)
Router.post('/verify',verify);

export default Router;