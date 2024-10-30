import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import House_User from '../model/User.js';



dotenv.config();

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await House_User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new House_User({ name, email, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDoc = await House_User.findOne({ email });
        if (!userDoc) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, userDoc.password);
        if (!isPasswordValid) {
            return res.status(422).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ email: userDoc.email, id: userDoc._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token'); 
    res.json({ message: 'Logged out successfully' });
};



export const profile = async (req, res) => {
  
    const { token } = req.cookies;
  // console.log(token)
    if (token) {
      try {
        jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
          if (err) return res.status(401).json({ error: 'Invalid token' });
  
          const user = await House_User.findById(userData.id);
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
  