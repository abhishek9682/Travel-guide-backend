const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    languages: [{
        type: String,
        trim: true
    }],
    experience: {
        type: Number, // Years of experience
        default: 0
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    profileImage: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    role: {
        type: String,
        default: 'guide'
    }
}, { timestamps: true });

module.exports = mongoose.model('Guide', guideSchema);
