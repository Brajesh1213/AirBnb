// uploadController.js

import path from 'path';
import fs from 'fs';
import Place from '../model/place.js'
import { downloadPhoto } from '../utils/imagedownlaoder.js';



// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export const uploadByLink = async (req, res) => {
  try {
    const { link } = req.body;
    console.log(link);

    const destPath = path.resolve(process.cwd(), 'upload'); // Corrects path to the 'uploads' folder
    const newName = 'photo-' + Date.now() + '.jpg';
    const dest = path.join(destPath, newName); // Ensure no duplication of folder structure

    // Use your custom imageDownloader function
    await downloadPhoto(link, destPath, newName);

    res.json({ fileName: newName });
  } catch (err) {
    console.error('Error uploading by link:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const uploadPhotos = (req, res) => {
  try {
    const uploadedFiles = req.files.map(file => {
      const ext = path.extname(file.originalname);
      const newPath = file.path + ext;
      fs.renameSync(file.path, newPath);
      return newPath;
    });


    res.json(uploadedFiles);
  } catch (err) {
    console.error('Error processing uploads:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const createPlace = async (req, res) => {
  try {
      console.log('Authenticated user:', req.user); 
      const { title, address,price, city, state, zip, photos, description, perks, extraInfo, checkIn, checkOut, maxGuests } = req.body;

      const owner = req.user.id;
      if(!owner){
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const newPlace = new Place({
          owner:owner,
          title,
          address,
          price,
          city,
          state,
          zip,
          photos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
      });

      await newPlace.save();
      res.status(201).json(newPlace);
  } catch (error) {
      console.error('Error creating place:', error);
      res.status(500).json({ message: error.message });
  }
};


export const getAllPlaces = async (req, res) => {
    try {
        const places = await Place.find().populate('owner'); 
        res.status(200).json(places);
    } catch (error) {
        console.error('Error retrieving places:', error);
        res.status(500).json({ message: error.message });
    }
};
export const getAllPlacesOfOwner = async (req, res) => {
  try {
    const ownerId = req.user.id; // Use optional chaining

    if (!ownerId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const places = await Place.find({ owner: ownerId })
      .populate('owner', '-password -__v')  // Exclude sensitive fields
      .select('-__v')  // Exclude version key
      .sort({ createdAt: -1 }); // Optional: sort by creation date, newest first
    
    // Return empty array instead of 404 if no places found
    // This is a better practice for empty collections
    res.status(200).json(places);

  } catch (error) {
    console.error('Error retrieving owner places:', error);
    res.status(500).json({ error: 'Failed to retrieve places' });
  }
};




export const getPlaceById = async (req, res) => {
    try {
        const place = await Place.findById(req.params.id).populate('owner');
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.status(200).json(place);
    } catch (error) {
        console.error('Error retrieving place:', error);
        res.status(500).json({ message: error.message });
    }
};


// Update a place by ID
export const updatePlace = async (req, res) => {
    try {
        const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.status(200).json(place);
    } catch (error) {
        console.error('Error updating place:', error);
        res.status(500).json({ message: error.message });
    }
};



export const deletePlace = async (req, res) => {
    try {
        const place = await Place.findByIdAndDelete(req.params.id);
        if (!place) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting place:', error);
        res.status(500).json({ message: error.message });
    }
};
