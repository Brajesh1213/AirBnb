import express from 'express';
import multer from 'multer'
// import { register, login, logout,profile, upload_by_link, upload } from '../controller/user_controller.js';
import { verifyToken } from './utils/verify_house_owner.js';
import {  uploadPhotos, uploadByLink, createPlace, getAllPlaces, updatePlace, deletePlace, getPlaceById, getAllPlacesOfOwner } from './controller/placecontroller.js'
import { login, logout, profile, register } from './controller/House_owner_controller.js';
import { authenticateUser } from './utils/authenticateuser.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', verifyToken, logout);
 
router.get('/check', verifyToken, (req, res) => {
    res.send('Middleware working');

});
router.get('/profile',profile);




const photosMiddleware = multer({ dest: 'upload' });

// Route to upload by link
router.post('/upload-by-link', uploadByLink);


router.post('/uploads', (req, res, next) => {
    console.log(req.body);
    console.log(req.files); 
    next();
  }, photosMiddleware.array('photos', 100), uploadPhotos);

  router.post('/upload_places',verifyToken,createPlace);
  router.get('/getAllPlaces',getAllPlaces);
  router.get('/places/:id', verifyToken,getPlaceById);
  router.get('/places_by_owner/:id', verifyToken,getAllPlacesOfOwner);
  router.put('/places/:id',authenticateUser, updatePlace);  
  router.delete('/delete_place',authenticateUser,deletePlace);

 

export default router;
