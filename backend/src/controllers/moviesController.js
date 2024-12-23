const { moviesModel } = require('../models/moviesModel');
const { screeningsModel } = require('../models/screeningsModel');
const { usersModel } = require('../models/usersModel');
const { notificationsModel } = require('../models/notificationsModel');

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

exports.createMovie = async (req, res) => {
    try {
        const movie = new moviesModel(req.body);
        const savedMovie = await movie.save();
        const populatedMovie = await savedMovie.populate('genres', 'name');
        const genreIds = populatedMovie.genres.map(genre => genre._id);
        const interestedUsers = await usersModel.find({
            favoriteGenres: { $in: genreIds },
            isAdmin: false
        }).select('_id'); 

        const uniqueUserIds = [...new Set(interestedUsers.map(user => user._id.toString()))];

        const notifications = uniqueUserIds.map(userId => ({
            user: userId,
            text: "E' stato inserito un film di un genere che segui, presto potranno essere pubblicate delle proiezioni! Premi qui per andare alla pagina del film.",
            resource: savedMovie._id
        }));

        await notificationsModel.insertMany(notifications);

        res.json(populatedMovie);
    } catch (err) {
        res.status(500).send(err);
    }
};

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

exports.availableMovies = async (req, res) => {
    try {
        const moviesWithFutureScreenings = await screeningsModel.aggregate([
            {
                $match: {
                    screeningDate: { $gt: new Date() } // Solo proiezioni future
                }
            },
            {
                $group: {
                    _id: '$movie' // Raggruppa per movie ID
                }
            }
        ]);

        const movieIds = moviesWithFutureScreenings.map(screening => screening._id);

        const availableMovies = await moviesModel.find({ _id: { $in: movieIds } })
            .populate('genres', 'name')
            .sort({ _id: -1 });

        res.json(availableMovies);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.availableMoviesByGenre = async (req, res) => {
    try {
        const genreId = req.params.genreId;

        const moviesWithFutureScreenings = await screeningsModel.aggregate([
            {
                $match: {
                    screeningDate: { $gt: new Date() } // Solo proiezioni future
                }
            },
            {
                $group: {
                    _id: '$movie' // Raggruppa per movie ID
                }
            }
        ]);

        const movieIds = moviesWithFutureScreenings.map(screening => screening._id);

        const availableMovies = await moviesModel.find({
            _id: { $in: movieIds },
            genres: genreId
        })
            .populate('genres', 'name')
            .sort({ _id: -1 });

        res.json(availableMovies);
    } catch (err) {
        res.status(500).send(err);
    }
};

exports.searchMoviesByTitle = (req, res) => {
    const title = req.params.title;

    moviesModel.find({ title: { $regex: `^${title}`, $options: 'i' } }) 
        .populate('genres', 'name') 
        .limit(4) 
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.latestMovies = (req, res) => {
    moviesModel.find()
        .sort({ _id: -1 }) // Ordina in ordine decrescente basandoti sull'_id
        .limit(5) // Limita i risultati agli ultimi 5 film
        .populate('genres', 'name') // Popola i generi per restituire anche i nomi dei generi
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};



