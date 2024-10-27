import jwt from 'jsonwebtoken';
import House_User from '../model/User.js';

export const authenticateUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from headers

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        const user = await House_User.findById(decoded.id); // Find the user based on the decoded ID

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; // Store the user information in req.user
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
