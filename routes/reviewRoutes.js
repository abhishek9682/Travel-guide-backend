const express = require('express');
const { addReview, getGuideReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect, addReview);
router.get('/:guideId', getGuideReviews);

module.exports = router;
