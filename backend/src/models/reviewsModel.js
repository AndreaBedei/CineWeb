const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        validate: {
            validator: function (id) {
                return mongoose.Types.ObjectId.isValid(id);
            },
            message: 'Invalid user ID'
        }
    },
    screening: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Screening',
        validate: {
            validator: function (id) {
                return mongoose.Types.ObjectId.isValid(id);
            },
            message: 'Invalid screening ID'
        }
    },
    text: {
        type: String,
        maxlength: 1000  
    },
    rating: {
        type: Number,
        min: 1,  
        max: 5   
    },
    reviewDate: {
        type: Date,
        default: Date.now  
    }
});

const reviewsModel = mongoose.model('Review', reviewSchema);

module.exports = { reviewsModel };
