const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: { type: String, unique: true }
});

const genresModel = mongoose.model('Genres', genreSchema);

module.exports = { genresModel }