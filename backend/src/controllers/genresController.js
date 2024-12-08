const { genresModel } = require('../models/genresModel');

exports.genresList = (req, res) => {
    genresModel.find()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.send(err);
        });
}