import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js'; 

dotenv.config();
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token,"gkjjk");
  

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    req.user = user;
    next(); 
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
