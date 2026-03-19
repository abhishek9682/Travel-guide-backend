const Guide = require('../models/guideModel');
const generateToken = require('../utils/tokenGenerator');

// @desc    Register a new guide
// @route   POST /api/guides/register
// @access  Public
const registerGuide = async (req, res, next) => {
    try {
        const { name, email, phone, city, languages, experience, pricePerDay, bio } = req.body;

        const guideExists = await Guide.findOne({ email });

        if (guideExists) {
            return res.status(400).json({ success: false, message: 'Guide already exists' });
        }

        const guide = await Guide.create({
            name,
            email,
            phone,
            city,
            languages: Array.isArray(languages) ? languages : [languages],
            experience,
            pricePerDay,
            bio,
            role: 'guide'
        });

        if (guide) {
            res.status(201).json({
                success: true,
                message: 'Guide registered successfully',
                data: {
                    _id: guide._id,
                    name: guide.name,
                    email: guide.email,
                    role: guide.role,
                    token: generateToken(guide._id, guide.role)
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid guide data' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get all guides (with optional search by city, language, experience)
// @route   GET /api/guides
// @access  Public
const getGuides = async (req, res, next) => {
    try {
        const { city, language, experience } = req.query;
        let query = {};

        if (city) {
            // Case-insensitive regex search for city
            query.city = { $regex: city, $options: 'i' };
        }

        if (language) {
            query.languages = { $regex: language, $options: 'i' };
        }

        if (experience) {
            query.experience = { $gte: Number(experience) };
        }

        const guides = await Guide.find(query).select('-__v');

        res.status(200).json({
            success: true,
            message: 'Guides fetched successfully',
            data: guides
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single guide by ID
// @route   GET /api/guides/:id
// @access  Public
const getGuideById = async (req, res, next) => {
    try {
        const guide = await Guide.findById(req.params.id)
            .populate('reviews')
            .select('-__v');

        if (guide) {
            res.status(200).json({
                success: true,
                message: 'Guide fetched successfully',
                data: guide
            });
        } else {
            res.status(404).json({ success: false, message: 'Guide not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update guide profile
// @route   PUT /api/guides/update
// @access  Private (Guide only)
const updateGuideProfile = async (req, res, next) => {
    try {
        const guide = await Guide.findById(req.user._id);

        if (guide && guide.role === 'guide') {
            guide.name = req.body.name || guide.name;
            guide.phone = req.body.phone || guide.phone;
            guide.city = req.body.city || guide.city;
            guide.languages = req.body.languages || guide.languages;
            guide.experience = req.body.experience || guide.experience;
            guide.pricePerDay = req.body.pricePerDay || guide.pricePerDay;
            guide.bio = req.body.bio || guide.bio;
            
            if (req.body.profileImage) {
                guide.profileImage = req.body.profileImage;
            }

            const updatedGuide = await guide.save();

            res.status(200).json({
                success: true,
                message: 'Guide profile updated successfully',
                data: updatedGuide
            });
        } else {
            res.status(404).json({ success: false, message: 'Guide not found or not authorized' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerGuide,
    getGuides,
    getGuideById,
    updateGuideProfile
};
