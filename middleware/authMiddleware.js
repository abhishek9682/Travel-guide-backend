const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token but exclude password
            req.user = await User.findById(decoded.id).select('-__v');

            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

// Optional middleware if role checking is needed
const guideAuth = async (req, res, next) => {
    if (req.user && req.user.role === 'guide') {
        next();
    } else {
        return res.status(403).json({ success: false, message: 'Not authorized as a guide' });
    }
};

module.exports = { protect, guideAuth };
