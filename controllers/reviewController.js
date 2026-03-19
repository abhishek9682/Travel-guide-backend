const Review = require('../models/reviewModel');
const Guide = require('../models/guideModel');

// @desc    Add a new review for a guide
// @route   POST /api/reviews/add
// @access  Private
const addReview = async (req, res, next) => {
    try {
        const { guideId, rating, comment } = req.body;

        const guide = await Guide.findById(guideId);
        if (!guide) {
            return res.status(404).json({ success: false, message: 'Guide not found' });
        }

        // Create review (Mongoose will prevent duplicate review thanks to index, but we can also check manually to provide better error)
        const existingReview = await Review.findOne({ guideId, userId: req.user._id });
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this guide' });
        }

        const review = await Review.create({
            userId: req.user._id,
            guideId,
            rating: Number(rating),
            comment
        });

        // Add review reference to guide model
        guide.reviews.push(review._id);
        await guide.save();
        // NOTE: Saving the guide does not interfere with the auto-update of rating, 
        // because the rating update logic runs async in the background.

        res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: review
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reviews for a guide
// @route   GET /api/reviews/:guideId
// @access  Public
const getGuideReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ guideId: req.params.guideId })
            .populate('userId', 'name profileImage')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Reviews fetched successfully',
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addReview,
    getGuideReviews
};
