const { reservationsModel } = require('../models/reservationsModel');
const mongoose = require('mongoose');

exports.reservationsList = (req, res) => {
    reservationsModel.find()
        .populate({
            path: 'screening',
            populate: [
                { path: 'movie', select: 'title' },
                { path: 'cinemaHall', select: 'name cinema' }
            ]
        })
        .populate({
            path: 'seats',
            select: 'row column',
        })
        .sort({ reservationDate: -1 })
        .then(docs => {
            const transformedDocs = docs.map(doc => ({
                ...doc.toObject(),
                screening: {
                    ...doc.screening,
                    cinemaHall: `${doc.screening.cinemaHall.name} - ${doc.screening.cinemaHall.cinema}`
                },
                seats: doc.seats.map(seat => `${seat.row}${seat.column}`)
            }));
            res.json(transformedDocs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};


exports.getReservationByID = (req, res) => {
    reservationsModel.findById(req.params.id)
        .populate({
            path: 'screening',
            populate: [
                { path: 'movie', select: 'title' },
                { path: 'cinemaHall', select: 'name' }
            ]
        })
        .populate({
            path: 'seats',
            select: 'row column',
        })
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Reservation not found');
            }
            const transformedDoc = {
                ...doc.toObject(),
                seats: doc.seats.map(seat => `${seat.row}${seat.column}`)
            };
            res.json(transformedDoc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};



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

    reservationsModel.find()
        .where('user').equals(userId)
        .populate({
            path: 'screening',
            populate: [
                { path: 'movie', select: 'title' },
                { path: 'cinemaHall', select: 'name cinema' }
            ]
        })
        .populate({
            path: 'seats',
            select: 'row column',
        })
        .sort({ reservationDate: -1 })
        .then(docs => {
            const transformedDocs = docs.map(doc => ({
                ...doc.toObject(),
                screening: {
                    ...doc.screening,
                    cinemaHall: `${doc.screening.cinemaHall.name} - ${doc.screening.cinemaHall.cinema}`
                },
                seats: doc.seats.map(seat => `${seat.row}${seat.column}`)
            }));
            return res.json(transformedDocs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.findReservationsByScreening = (req, res) => {
    const screeningId = req.params.screeningId;

    reservationsModel.find({ screening: screeningId })
        .populate({
            path: 'screening',
            populate: [
                { path: 'movie', select: 'title' },
                { path: 'cinemaHall', select: 'name cinema' }
            ]
        })
        .populate({
            path: 'seats',
            select: 'row column',
        })
        .sort({ reservationDate: -1 })
        .then(docs => {
            const transformedDocs = docs.map(doc => ({
                ...doc.toObject(),
                screening: {
                    ...doc.screening,
                    cinemaHall: `${doc.screening.cinemaHall.name} - ${doc.screening.cinemaHall.cinema}`
                },
                seats: doc.seats.map(seat => `${seat.row}${seat.column}`)
            }));
            return res.json(transformedDocs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.getPastReservationsByUser = (req, res) => {
    const userId = req.params.userId;

    reservationsModel.find({
        $and: [
            { user: userId },
            { reservationDate: { $lt: new Date() } }
        ]
    })
        .populate({
            path: 'screening',
            populate: [
                { path: 'movie', select: 'title' },
                { path: 'cinemaHall', select: 'name cinema' }
            ]
        })
        .populate({
            path: 'seats',
            select: 'row column',
        })
        .sort({ reservationDate: -1 })
        .then(docs => {
            if (docs.length === 0) {
                return res.status(404).send('No past reservations found for this user');
            }
            const transformedDocs = docs.map(doc => ({
                ...doc.toObject(),
                screening: {
                    ...doc.screening,
                    cinemaHall: `${doc.screening.cinemaHall.name} - ${doc.screening.cinemaHall.cinema}`
                },
                seats: doc.seats.map(seat => `${seat.row}${seat.column}`)
            }));
            return res.json(transformedDocs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.getFutureReservationsByUser = (req, res) => {
    const userId = req.params.userId;

    reservationsModel.find({
        $and: [
            { user: userId },
            { reservationDate: { $gt: new Date() } }
        ]
    })
        .populate({
            path: 'screening',
            populate: [
                { path: 'movie', select: 'title' },
                { path: 'cinemaHall', select: 'name cinema' }
            ]
        })
        .populate({
            path: 'seats',
            select: 'row column',
        })
        .sort({ reservationDate: 1 })
        .then(docs => {
            if (docs.length === 0) {
                return res.status(404).send('No future reservations found for this user');
            }
            const transformedDocs = docs.map(doc => ({
                ...doc.toObject(),
                screening: {
                    ...doc.screening,
                    cinemaHall: `${doc.screening.cinemaHall.name} - ${doc.screening.cinemaHall.cinema}`
                },
                seats: doc.seats.map(seat => `${seat.row}${seat.column}`)
            }));
            return res.json(transformedDocs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};


