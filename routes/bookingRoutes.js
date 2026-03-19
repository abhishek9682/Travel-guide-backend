const express = require('express');
const { createBooking, getUserBookings, getGuideBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect, guideAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/guide', protect, guideAuth, getGuideBookings);
router.put('/status', protect, guideAuth, updateBookingStatus);

module.exports = router;
