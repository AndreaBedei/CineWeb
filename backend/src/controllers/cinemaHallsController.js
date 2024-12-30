const { cinemaHallsModel } = require('../models/cinemaHallsModel');
const { seatsModel } = require('../models/seatsModel');

exports.cinemaHallsList = (req, res) => {
    cinemaHallsModel.find()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.getCinemaHallFromID = (req, res) => {
    cinemaHallsModel.findById(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Cinema hall not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.createCinemaHall = async (req, res) => {
    try {
        const cinemaHall = new cinemaHallsModel(req.body);
        const savedCinemaHall = await cinemaHall.save();
        const { numberOfRows, numberOfColumns } = savedCinemaHall;
        const seats = [];

        for (let row = 0; row < numberOfRows; row++) {
            for (let column = 0; column < numberOfColumns; column++) {
                seats.push({ cinemaHall: savedCinemaHall._id, row, column });
            }
        }

        await seatsModel.insertMany(seats);

        res.status(201).json(savedCinemaHall);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.updateCinemaHall = async (req, res) => {
    try {
        const cinemaHallId = req.params.id;

        const existingCinemaHall = await cinemaHallsModel.findById(cinemaHallId);
        if (!existingCinemaHall) {
            return res.status(404).send('Cinema hall not found');
        }

        await seatsModel.updateMany({ cinemaHall: cinemaHallId }, { isAvailable: false });

        const updatedCinemaHall = await cinemaHallsModel.findByIdAndUpdate(
            cinemaHallId,
            req.body,
            { new: true }
        );

        const { numberOfRows, numberOfColumns } = updatedCinemaHall;
        const seats = [];

        // Creiamo nuovi posti per la sala aggiornata
        for (let row = 0; row < numberOfRows; row++) {
            for (let column = 0; column < numberOfColumns; column++) {
                seats.push({ cinemaHall: updatedCinemaHall._id, row, column, isAvailable: true });
            }
        }

        await seatsModel.insertMany(seats);

        res.json(updatedCinemaHall);
    } catch (err) {
        res.status(500).send(err);
    }
};


exports.deleteCinemaHall = async (req, res) => {
    try {
        const cinemaHallId = req.params.id;

        const cinemaHall = await cinemaHallsModel.findById(cinemaHallId);
        if (!cinemaHall) {
            return res.status(404).send('Cinema hall not found');
        }

        await seatsModel.updateMany({ cinemaHall: cinemaHallId }, { isAvailable: false });

        await cinemaHallsModel.findByIdAndDelete(cinemaHallId);

        res.json({ message: 'Cinema hall deleted and associated seats marked as unavailable' });
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.getCinemaHallsByCinema = (req, res) => {
    const cinemaName = req.params.cinema; 

    cinemaHallsModel.find({ cinema: cinemaName }) 
        .then(docs => {
            if (!docs) {
                return res.status(404).send('No cinema halls found for the specified cinema');
            }
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.getCinemaHallDetails = (req, res) => {
    const { cinemaName, hallName } = req.params;

    cinemaHallsModel.findOne({ cinema: cinemaName, name: hallName })
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Cinema hall not found');
            }
            res.json({
                numberOfRows: doc.numberOfRows,
                numberOfColumns: doc.numberOfColumns
            });
        })
        .catch(err => {
            res.status(500).send(err);
        });
};