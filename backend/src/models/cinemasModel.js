const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    address: { type: String, required: true },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\+?[0-9]{7,15}$/.test(v); 
            },
            message: 'Invalid phone number format.'
        },
        required: true
    }
});

const cinemasModel = mongoose.model('Cinema', cinemaSchema);

module.exports = { cinemasModel };