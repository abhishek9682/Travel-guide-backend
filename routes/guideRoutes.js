const express = require('express');
const { registerGuide, getGuides, getGuideById, updateGuideProfile } = require('../controllers/guideController');
const { protect, guideAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerGuide);
router.get('/', getGuides);
router.get('/:id', getGuideById);
router.put('/update', protect, guideAuth, updateGuideProfile);

module.exports = router;
