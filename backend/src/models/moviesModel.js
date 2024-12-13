const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, unique: true },
    genres: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genres' }],
        validate: {
            validator: function (array) {
                return array.every(id => mongoose.Types.ObjectId.isValid(id));
            },
            message: 'All genres IDs must be present in genres schema'
        }
    },
    isAvailable: { type: Boolean, default: true },
    trailerLink: String,
    poster: String
});

const moviesModel = mongoose.model('Movie', movieSchema);

module.exports = { moviesModel };
