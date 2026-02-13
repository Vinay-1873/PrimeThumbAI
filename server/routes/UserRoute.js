import express from 'express';
import { getThumbnailbyId, getUserThumbnails, updateProfileImage } from '../controller/UserController.js';
import protect from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

const UserRouter = express.Router();

UserRouter.get('/thumbnails',protect, getUserThumbnails)
UserRouter.get('/thumbnail/:id',protect, getThumbnailbyId)
UserRouter.post('/update-profile-image', protect, upload.single('profileImage'), updateProfileImage);

export default UserRouter