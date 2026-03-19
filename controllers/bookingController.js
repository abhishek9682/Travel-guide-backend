const Booking = require('../models/bookingModel');
const Guide = require('../models/guideModel');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

// @desc    Create a new booking
// @route   POST /api/bookings/create
// @access  Private
const createBooking = async (req, res, next) => {
    try {
        const { guideId, date, duration } = req.body;

        const guide = await Guide.findById(guideId);

        if (!guide) {
            return res.status(404).json({ success: false, message: 'Guide not found' });
        }

        const totalPrice = guide.pricePerDay * duration;

        const booking = await Booking.create({
            userId: req.user._id,
            guideId,
            date,
            duration,
            totalPrice,
            status: 'pending'
        });

        // Send confirmation email to user
        await sendEmail({
            email: req.user.email,
            subject: 'Booking Request Received',
            message: `Your booking request for guide ${guide.name} has been received. Total Price: $${totalPrice}. Please await guide confirmation.`
        });

        // Send notification email to guide
        await sendEmail({
            email: guide.email,
            subject: 'New Booking Request',
            message: `You have received a new booking request from ${req.user.name} for ${duration} days on ${date}.`
        });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/user
// @access  Private
const getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate('guideId', 'name email phone profileImage');

        res.status(200).json({
            success: true,
            message: 'User bookings fetched successfully',
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get guide's bookings
// @route   GET /api/bookings/guide
// @access  Private (Guide)
const getGuideBookings = async (req, res, next) => {
    try {
        // Ensure the logged-in user is actually the guide in question
        const bookings = await Booking.find({ guideId: req.user._id }).populate('userId', 'name email phone profileImage');

        res.status(200).json({
            success: true,
            message: 'Guide bookings fetched successfully',
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/status
// @access  Private (Guide)
const updateBookingStatus = async (req, res, next) => {
    try {
        const { bookingId, status } = req.body;

        const booking = await Booking.findById(bookingId).populate('userId', 'email name');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Check if the current user is the guide for this booking
        if (booking.guideId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
        }

        booking.status = status;
        await booking.save();

        // Send notification email to user about status change
        await sendEmail({
            email: booking.userId.email,
            subject: `Booking Status Update: ${status.toUpperCase()}`,
            message: `Your booking status has been updated to ${status}.`
        });

        res.status(200).json({
            success: true,
            message: 'Booking status updated successfully',
            data: booking
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBooking,
    getUserBookings,
    getGuideBookings,
    updateBookingStatus
};
