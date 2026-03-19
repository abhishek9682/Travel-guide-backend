const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    profileImage: {
        type: String,
        default: null
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination'
    }],
    role: {
        type: String,
        default: 'user' // Either 'user' or 'guide' for differentiation later if needed
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
