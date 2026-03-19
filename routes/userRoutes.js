const express = require('express');
const { registerUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.get('/profile', protect, getUserProfile);
router.put('/update', protect, updateUserProfile);

module.exports = router;
