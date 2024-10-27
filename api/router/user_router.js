import { Router } from 'express';
import { check, register, login,profile,logout, upload_by_link, upload } from '../controller/user_controller.js'; 
import { authenticateUser } from '../middleware/userconfigration.js';

const router = Router();

router.get('/check', check);
router.post('/register', register);
router.post('/login', login);
router.get('/profile',authenticateUser,profile);
router.post('/logout',logout);
router.post('upload-by-link',upload_by_link)
router.post('/upload',upload)


export default router;
