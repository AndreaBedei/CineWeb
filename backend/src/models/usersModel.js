const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    birthdate: Date,
    email: { type: String, unique: true },
    password: String,
    salt: String,
    isAdmin: Boolean,
    favoriteGenres: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genres' }],
        validate: {
            validator: function (array) {
                return array.length <= 5;
            },
            message: 'Un utente può avere al massimo 5 generi preferiti'
        }
    }
});

const usersModel = mongoose.model('User', userSchema);

module.exports = { usersModel };