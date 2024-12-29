const { reservationsModel } = require('../models/reservationsModel');
const { screeningsModel } = require('../models/screeningsModel');
const { seatsModel } = require('../models/seatsModel');
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

exports.createReservation = async (req, res) => {
    const { screeningId, seats, userId, price } = req.body;
    console.log(req.body);

    if (!screeningId || !seats || !userId || !price) {
        return res.status(400).send('Missing required fields');
    }

    console.log(screeningId, seats, userId, price);
    try {
        // Step 1: Find the cinema hall ID associated with the screening
        const screening = await screeningsModel.findById(screeningId).populate('cinemaHall');
        if (!screening) {
            return res.status(404).send('Screening not found');
        }
        console.log("ho fatto gli screening");
        const cinemaHallId = screening.cinemaHall._id;

        // Step 2: Iterate through the seats array to find seat IDs
        const seatIds = [];
        for (const seat of seats) {
            const { row, col } = seat;
            console.log(row, col, cinemaHallId);
            const seatDoc = await seatsModel.findOne({
                cinemaHall: cinemaHallId,
                row: row,
                column: col,
                isAvailable: true
            });

            if (!seatDoc) {
                return res.status(400).send(`Seat at row ${row}, column ${col} does not exist.`);
            }

            seatIds.push(seatDoc._id);
        }
        console.log("ho fatto anche tutti i seats");

        // Step 3: Create the reservation
        const newReservation = new reservationsModel({
            user: userId,
            screening: screeningId,
            seats: seatIds,
            totalPaid: price,
        });

        await newReservation.save();

        res.status(201).json(newReservation);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while creating the reservation');
    }
};


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

    reservationsModel.find({ user: userId })
        .populate({
            path: 'screening',
            populate: {
                path: 'cinemaHall',
                select: 'name cinema'
            }
        })
        .sort({ 'screening.screeningDate': -1 }) // Ordina per data decrescente
        .limit(10) // Limita a 10 risultati
        .then(docs => {
            const pastReservations = docs.filter(doc => {
                const screeningDate = new Date(doc.screening.screeningDate);
                return screeningDate < new Date();
            });

            if (pastReservations.length === 0) {
                return res.status(200).send("");
            }

            const transformedDocs = pastReservations.map(doc => ({
                ...doc.toObject(),
                screening: {
                    ...doc.screening,
                    cinemaHall: `${doc.screening.cinemaHall.name} - ${doc.screening.cinemaHall.cinema}`
                },
                seats: doc.seats.map(seat => `${seat.row}${seat.column}`),
                movieTitle: doc.screening.movieTitle // Usa direttamente il campo movieTitle
            }));

            return res.json(transformedDocs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};



exports.getFutureReservationsByUser = (req, res) => {
    const userId = req.params.userId;

    reservationsModel.find({ user: userId })
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
        .then(docs => {
            const futureReservations = docs.filter(doc => {
                const screeningDate = new Date(doc.screening.screeningDate);
                return screeningDate > new Date(); 
            });

            if (futureReservations.length === 0) {
                return res.status(200).send("");
            }

            const transformedDocs = futureReservations.map(doc => ({
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