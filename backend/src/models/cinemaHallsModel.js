const mongoose = require('mongoose');

const cinemaHallSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    numberOfRows: {
        type: Number,
        min: 1
    },
    numberOfColumns: {
        type: Number,
        min: 1
    },
});

const cinemaHallsModel = mongoose.model('CinemaHall', cinemaHallSchema);

module.exports = { cinemaHallsModel };
