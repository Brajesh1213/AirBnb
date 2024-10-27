import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token =
        req.cookies.token || 
        req.headers['authorization']?.split(' ')[1]; // Check the Authorization header

    console.log('Token:', token); // Debugging

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        console.error('Invalid token:', err);
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

