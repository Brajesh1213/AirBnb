import User from '../models/User.js'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret'; 

export const check = (req, res) => {
    res.send("Hello, user router!");
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userDoc = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.json({ name: userDoc.name, email: userDoc.email });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userDoc = await User.findOne({ email });
        if (!userDoc) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, userDoc.password);
        if (!isPasswordValid) {
            return res.status(422).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // Secure cookies in production
        res.json({ name: userDoc.name, email: userDoc.email, token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const profile = async (req, res) => {
  
  const { token } = req.cookies;

  if (token) {
    try {
      jwt.verify(token, jwtSecret, async (err, userData) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });

        const user = await User.findById(userData.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { name, email, _id } = user;
        res.json({ name, email, _id });
      });
    } catch (err) {
      console.error('Error retrieving profile:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    console.log('No token provided');
    res.status(422).json({ error: 'No token provided' });
  }
};



export  const logout=('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production',Credential:true }).json(true);
});


export  const upload_by_link=('/upload-by-link', async (req, res) => {
  try {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
      url: link,
      dest: path.join(path.resolve(), 'uploads', newName),
    });
    res.json({ fileName: newName });
  } catch (err) {
    console.error('Error uploading by link:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const photosMiddleware = multer({ dest: 'uploads/' });

 export const upload = ('/uploads', photosMiddleware.array('photos', 100), (req, res) => {
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
});