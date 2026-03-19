const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Upload an image
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Return relative path for frontend access
    res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        data: `/${req.file.path.replace(/\\/g, '/')}`
    });
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
router.post('/multiple', protect, upload.array('images', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    
    // Return an array of relative paths
    const paths = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);

    res.status(200).json({
        success: true,
        message: 'Images uploaded successfully',
        data: paths
    });
});

module.exports = router;
