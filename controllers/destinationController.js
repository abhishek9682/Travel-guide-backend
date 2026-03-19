const Destination = require('../models/destinationModel');

// @desc    Add a new destination
// @route   POST /api/destinations
// @access  Private/Admin (Skipping strict Admin check for now, can be protected)
const addDestination = async (req, res, next) => {
    try {
        const destination = await Destination.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Destination added successfully',
            data: destination
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all destinations (with optional search by city and name)
// @route   GET /api/destinations
// @access  Public
const getDestinations = async (req, res, next) => {
    try {
        const { city, name } = req.query;
        let query = {};

        if (city) {
            query.city = { $regex: city, $options: 'i' };
        }

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        const destinations = await Destination.find(query).select('-__v');

        res.status(200).json({
            success: true,
            message: 'Destinations fetched successfully',
            data: destinations
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single destination by ID
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = async (req, res, next) => {
    try {
        const destination = await Destination.findById(req.params.id).select('-__v');

        if (destination) {
            res.status(200).json({
                success: true,
                message: 'Destination fetched successfully',
                data: destination
            });
        } else {
            res.status(404).json({ success: false, message: 'Destination not found' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addDestination,
    getDestinations,
    getDestinationById
};
