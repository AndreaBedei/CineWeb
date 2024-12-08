const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    cinemaHall: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CinemaHall',
    },
    row: {
        type: Number,
        required: true,
        min: 1
    },
    column: {
        type: Number,
        required: true,
        min: 1
    }
});

const seatsModel = mongoose.model('Seat', seatSchema);

module.exports = { seatsModel };
