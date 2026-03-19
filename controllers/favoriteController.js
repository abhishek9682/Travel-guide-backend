const User = require('../models/userModel');
const Destination = require('../models/destinationModel');

// @desc    Add a destination to favorites
// @route   POST /api/favorites/add
// @access  Private
const addFavorite = async (req, res, next) => {
    try {
        const { destinationId } = req.body;

        if (!destinationId) {
            return res.status(400).json({ success: false, message: 'Destination ID is required' });
        }

        const destination = await Destination.findById(destinationId);
        if (!destination) {
            return res.status(404).json({ success: false, message: 'Destination not found' });
        }

        const user = await User.findById(req.user._id);

        // Check if already in favorites
        if (user.favorites.includes(destinationId)) {
            return res.status(400).json({ success: false, message: 'Destination is already in favorites' });
        }

        user.favorites.push(destinationId);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Destination added to favorites successfully',
            data: user.favorites
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');

        res.status(200).json({
            success: true,
            message: 'Favorites fetched successfully',
            data: user.favorites
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove a destination from favorites
// @route   DELETE /api/favorites/remove
// @access  Private
const removeFavorite = async (req, res, next) => {
    try {
        const { destinationId } = req.body;

        if (!destinationId) {
            return res.status(400).json({ success: false, message: 'Destination ID is required' });
        }

        const user = await User.findById(req.user._id);

        user.favorites = user.favorites.filter(
            (fav) => fav.toString() !== destinationId.toString()
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Destination removed from favorites successfully',
            data: user.favorites
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addFavorite,
    getFavorites,
    removeFavorite
};
