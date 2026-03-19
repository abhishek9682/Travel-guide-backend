const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    bestTimeToVisit: {
        type: String,
        trim: true
    },
    entryFee: {
        type: Number,
        default: 0
    },
    images: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
