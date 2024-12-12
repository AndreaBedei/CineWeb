const { reservationsModel } = require('../models/reservationsModel');

exports.reservationsList = (req, res) => {
    reservationsModel.find()
        .sort({ reservationDate: -1 })
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.getReservationByID = (req, res) => {
    reservationsModel.findById(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Reservation not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.createReservation = (req, res) => {
    const reservation = new reservationsModel(req.body);
    reservation.save()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.updateReservation = (req, res) => {
    reservationsModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Reservation not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.deleteReservation = (req, res) => {
    reservationsModel.findByIdAndDelete(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Reservation not found');
            }
            res.json({ message: 'Reservation deleted' });
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.findReservationsByUser = (req, res) => {
    const userId = req.params.userId;

    reservationsModel.find({ user: userId })
        .sort({ reservationDate: -1 })
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.findReservationsByScreening = (req, res) => {
    const screeningId = req.params.screeningId;

    reservationsModel.find({ screening: screeningId })
        .sort({ reservationDate: -1 })
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.getPastReservationsByUser = (req, res) => {
    const userId = req.params.userId;

    reservationsModel.find({
        user: userId,
        reservationDate: { $lt: Date.now() } 
    })
    .sort({ reservationDate: -1 }) 
    .then(docs => {
        if (docs.length === 0) {
            return res.status(404).send('No past reservations found for this user');
        }
        res.json(docs);
    })
    .catch(err => {
        res.status(500).send(err);
    });
};

exports.getFutureReservationsByUser = (req, res) => {
    const userId = req.params.userId;

    reservationsModel.find({
        user: userId,
        reservationDate: { $gt: Date.now() } 
    })
    .sort({ reservationDate: 1 }) 
    .then(docs => {
        if (docs.length === 0) {
            return res.status(404).send('No future reservations found for this user');
        }
        res.json(docs);
    })
    .catch(err => {
        res.status(500).send(err);
    });
};

