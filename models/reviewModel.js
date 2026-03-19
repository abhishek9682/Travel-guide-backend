const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    guideId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guide',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        trim: true
    }
}, { timestamps: true });

// Prevent user from submitting more than one review per guide
reviewSchema.index({ guideId: 1, userId: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calcAverageRatings = async function(guideId) {
    const obj = await this.aggregate([
        {
            $match: { guideId: guideId }
        },
        {
            $group: {
                _id: '$guideId',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await mongoose.model('Guide').findByIdAndUpdate(guideId, {
            rating: obj.length > 0 ? Math.round(obj[0].averageRating * 10) / 10 : 0
        });
    } catch (err) {
        console.error('Error updating guide rating:', err);
    }
};

// Call calcAverageRatings after save
reviewSchema.post('save', function() {
    this.constructor.calcAverageRatings(this.guideId);
});

// Call calcAverageRatings after insertMany (if used)
reviewSchema.post('insertMany', function(docs) {
    if (docs.length > 0) {
        docs[0].constructor.calcAverageRatings(docs[0].guideId);
    }
});

// Call calcAverageRatings before remove
reviewSchema.pre('remove', function(next) {
    this.constructor.calcAverageRatings(this.guideId);
    next();
});

module.exports = mongoose.model('Review', reviewSchema);
