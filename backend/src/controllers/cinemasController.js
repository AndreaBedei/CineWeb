const { cinemasModel } = require('../models/cinemasModel');

exports.cinemaList = (req, res) => {
    cinemasModel.find()
        .sort({ name: 1 }) 
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.readCinema = (req, res) => {
    cinemasModel.findById(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Cinema not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.createCinema = (req, res) => {
    const cinema = new cinemsaModel(req.body);
    cinema.save()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.updateCinema = (req, res) => {
    cinemasModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Cinema not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.deleteCinema = (req, res) => {
    cinemasModel.findByIdAndDelete(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Cinema not found');
            }
            res.json({ message: 'Cinema deleted' });
        })
        .catch(err => {
            res.status(500).send(err);
        });
};