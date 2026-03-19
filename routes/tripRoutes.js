const express = require('express');
const { createTrip, getTrips, updateTrip, deleteTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createTrip);
router.get('/', protect, getTrips);
router.put('/update/:id', protect, updateTrip);
router.delete('/delete/:id', protect, deleteTrip);

module.exports = router;
