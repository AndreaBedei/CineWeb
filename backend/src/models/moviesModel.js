const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, unique: true },
    year: Number,
    rated: String,
    released: Date,
    runtime: Number,
    countries: [String],
    genres: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genres' }],
        validate: {
            validator: function (array) {
                return array.every(id => mongoose.Types.ObjectId.isValid(id));
            },
            message: 'All genres IDs must be present in genres schema'
        }
    },
    director: String,
    writers: [String],
    actors: [String],
    plot: String,
    poster: String,
    imdb: {
        id: String,
        rating: Number,
        votes: Number
    },
    awards: {
        wins: Number,
        nominations: Number,
        text: String
    },
    type: String
});

const moviesModel = mongoose.model('Movie', movieSchema);

module.exports = { moviesModel };
