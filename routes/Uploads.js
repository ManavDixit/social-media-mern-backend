import express from 'express';
const Router=express.Router();
import {authenticate} from '../middleware/auth.js';
import { getImage ,getVideo} from '../controllers/Uploads.js';
Router.get('/image',authenticate,getImage)
Router.get('/video',authenticate,getVideo)
export default Router;