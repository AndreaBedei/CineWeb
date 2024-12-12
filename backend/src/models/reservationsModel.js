const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
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
    seats: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seat' }],
        required: true,
        validate: {
            validator: function (array) {
                return array.length > 0; 
            },
            message: 'No seat selected'
        }
    },
    totalPaid: {
        type: Number,
        required: true,
        min: 0
    },
    reservationDate: {
        type: Date,
        default: Date.now
    }
});

const reservationsModel = mongoose.model('Reservation', reservationSchema);

module.exports = { reservationsModel };
