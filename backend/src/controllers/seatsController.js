const { seatsModel } = require('../models/seatsModel');
const { cinemaHallsModel } = require('../models/cinemaHallsModel');

exports.seatsList = (req, res) => {
    seatsModel.find()
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.readSeat = (req, res) => {
    seatsModel.findById(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Seat not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.createSeat = (req, res) => {
    const seat = new seatsModel(req.body);
    seat.save()
        .then(doc => {
            res.status(201).json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.updateSeat = (req, res) => {
    seatsModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Seat not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.deleteSeat = (req, res) => {
    seatsModel.findByIdAndDelete(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Seat not found');
            }
            res.json({ message: 'Seat deleted' });
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.findSeatsByHall = (req, res) => {
    const { hallId } = req.query;

    if (!hallId) {
        return res.status(400).send('Missing hall ID');
    }

    cinemaHallsModel.findById(hallId)
        .then(hall => {
            if (!hall) {
                return res.status(404).send('Cinema hall not found');
            }
            seatsModel.find({ cinemaHall: hallId })
                .then(docs => {
                    res.json(docs);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        })
        .catch(err => {
            res.status(500).send(err);
        });
}
