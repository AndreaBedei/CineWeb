const { cinemaHallsModel } = require('../models/cinemaHallsModel');

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

exports.createCinemaHall = (req, res) => {
    const cinemaHall = new cinemaHallsModel(req.body);
    cinemaHall.save()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.updateCinemaHall = (req, res) => {
    cinemaHallsModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
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

exports.deleteCinemaHall = (req, res) => {
    cinemaHallsModel.findByIdAndDelete(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Cinema hall not found');
            }
            res.json({ message: 'Cinema hall deleted' });
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.getCinemaHallsByCinema = (req, res) => {
    const cinemaName = req.params.cinema; // Ottieni il nome del cinema dai parametri della richiesta

    cinemaHallsModel.find({ cinema: cinemaName }) // Filtra per il campo "cinema"
        .then(docs => {
            if (!docs || docs.length === 0) {
                return res.status(404).send('No cinema halls found for the specified cinema');
            }
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};
