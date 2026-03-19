const Trip = require('../models/tripModel');

// @desc    Create a new trip plan
// @route   POST /api/trips/create
// @access  Private
const createTrip = async (req, res, next) => {
    try {
        const trip = await Trip.create({
            ...req.body,
            userId: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Trip plan created successfully',
            data: trip
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's trip plans
// @route   GET /api/trips
// @access  Private
const getTrips = async (req, res, next) => {
    try {
        const trips = await Trip.find({ userId: req.user._id }).select('-__v');

        res.status(200).json({
            success: true,
            message: 'Trips fetched successfully',
            data: trips
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a trip plan
// @route   PUT /api/trips/update/:id
// @access  Private
const updateTrip = async (req, res, next) => {
    try {
        let trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        // Verify ownership
        if (trip.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'Trip updated successfully',
            data: trip
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a trip plan
// @route   DELETE /api/trips/delete/:id
// @access  Private
const deleteTrip = async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        // Verify ownership
        if (trip.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        await Trip.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Trip deleted successfully',
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTrip,
    getTrips,
    updateTrip,
    deleteTrip
};
