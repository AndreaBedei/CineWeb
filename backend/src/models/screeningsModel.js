const mongoose = require('mongoose');

const screeningSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        validate: {
            validator: function (id) {
                return mongoose.Types.ObjectId.isValid(id);
            },
            message: 'Invalid movie ID'
        }
    },
    cinemaHall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CinemaHall',
        validate: {
            validator: function (id) {
                return mongoose.Types.ObjectId.isValid(id);
            },
            message: 'Invalid cinema hall ID'
        }
    },
    ticketPrice: {
        type: Number,
        min: 0
    },
    screeningDate: Date,
    movieTitle: {
        type: String,
        required: true 
    }
});

const screeningsModel = mongoose.model('Screening', screeningSchema);

module.exports = { screeningsModel };
