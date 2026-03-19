const express = require('express');
const { addFavorite, getFavorites, removeFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect, addFavorite);
router.get('/', protect, getFavorites);
router.delete('/remove', protect, removeFavorite);

module.exports = router;
