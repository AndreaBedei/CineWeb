const { screeningsModel } = require('../models/screeningsModel');
const { moviesModel } = require('../models/moviesModel');
const { cinemaHallsModel } = require('../models/cinemaHallsModel');

exports.screeningsList = (req, res) => {
    screeningsModel.find()
        .populate('movie', 'title')
        .populate('cinemaHall', 'name')
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.getScreeningByID = (req, res) => {
    screeningsModel.findById(req.params.id)
        .populate('movie', 'title')
        .populate('cinemaHall', 'name')
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Screening not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.createScreening = (req, res) => {
    const screening = new screeningsModel(req.body);
    screening.save()
        .then(doc => {
            res.status(201).json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.updateScreening = (req, res) => {
    screeningsModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate('movie', 'title')
        .populate('cinemaHall', 'name')
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Screening not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.deleteScreening = (req, res) => {
    screeningsModel.findByIdAndDelete(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Screening not found');
            }
            res.json({ message: 'Screening deleted' });
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.findScreeningsByMovie = async (req, res) => {
    try {
        const screenings = await screeningsModel.find({ movie: req.params.movieId })
            .populate({
                path: 'cinemaHall',
                select: 'name cinema'
            });

        if (screenings.length === 0) {
            return res.status(404).send('No screenings found for this movie');
        }

        const groupedByCinema = screenings.reduce((acc, screening) => {
            const cinemaName = screening.cinemaHall.cinema || 'Unknown Cinema';
            if (!acc[cinemaName]) {
                acc[cinemaName] = [];
            }
            acc[cinemaName].push({
                screeningId: screening._id,
                cinemaHallName: screening.cinemaHall.name,
                ticketPrice: screening.ticketPrice,
                screeningDate: screening.screeningDate
            });
            return acc;
        }, {});

        res.json(groupedByCinema);
    } catch (err) {
        res.status(500).send(err);
    }
};


exports.findScreeningsByDate = (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).send('Date query parameter is required');
    }

    screeningsModel.find({
        screeningDate: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) }
    })
    .populate('movie', 'title')
    .populate('cinemaHall', 'name')
    .then(docs => {
        if (docs.length === 0) {
            return res.status(404).send('No screenings found on this date');
        }
        res.json(docs);
    })
    .catch(err => {
        res.status(500).send(err);
    });
}
