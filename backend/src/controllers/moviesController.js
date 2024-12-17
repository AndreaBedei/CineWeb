const { moviesModel } = require('../models/moviesModel');

exports.moviesList = (req, res) => {
    moviesModel.find()
        .populate('genres', 'name') 
        .sort({ _id: -1 }) 
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.send(err);
        });
}

exports.readMovie = (req, res) => {
    moviesModel.findById(req.params.id)
        .populate('genres', 'name') 
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Movie not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.createMovie = (req, res) => {
    const movie = new moviesModel(req.body);
    movie.save()
        .then(doc => {
            doc.populate('genres', 'name') 
                .then(populatedDoc => res.json(populatedDoc));
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.updateMovie = (req, res) => {
    moviesModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate('genres', 'name') 
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Movie not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.deleteMovie = (req, res) => {
    moviesModel.findByIdAndDelete(req.params.id)
        .populate('genres', 'name') 
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Movie not found');
            }
            res.json({ message: 'Movie deleted' });
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.availableMovies = (req, res) => {
    moviesModel.find()
        .where('isAvailable').equals(true)
        .populate('genres', 'name') 
        .sort({ _id: -1 }) 
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.availableMoviesByGenre = (req, res) => {
    const genreId = req.params.genreId;
    moviesModel.find()
        .where('genres').in([genreId])
        .where('isAvailable').equals(true)
        .populate('genres', 'name') 
        .sort({ _id: -1 }) 
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.searchMoviesByTitle = (req, res) => {
    const title = req.params.title;

    moviesModel.find({ title: { $regex: title, $options: 'i' } }) // Cerca ignorando maiuscole/minuscole
        .populate('genres', 'name') // Popola i generi con il nome
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

