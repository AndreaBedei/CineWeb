const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    cinemaHall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CinemaHall',
    },
    row: {
        type: Number,
        required: true
    },
    column: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
});

const seatsModel = mongoose.model('Seat', seatSchema);

module.exports = { seatsModel };