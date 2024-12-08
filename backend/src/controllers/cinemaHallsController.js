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