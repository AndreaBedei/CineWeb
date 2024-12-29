const { moviesModel } = require('../models/moviesModel');
const { screeningsModel } = require('../models/screeningsModel');
const { usersModel } = require('../models/usersModel');
const { notificationsModel } = require('../models/notificationsModel');
const { reservationsModel } = require('../models/reservationsModel');
const { reviewsModel } = require('../models/reviewsModel');
const mongoose = require('mongoose');

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

exports.deleteMovie = async (req, res) => {
    const movieId = req.params.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Eliminare tutte le recensioni per il film specificato
        await reviewsModel.deleteMany({ movie: movieId }).session(session);

        // 2. Eliminare tutte le notifiche che hanno il film come risorsa
        await notificationsModel.deleteMany({ resource: movieId }).session(session);

        // 3. Eliminare il film
        const movie = await moviesModel.findByIdAndDelete(movieId).session(session);

        if (!movie) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).send('Movie not found');
        }

        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Movie and related data deleted successfully' });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).send(err);
    }
};

exports.availableMovies = async (req, res) => {
    try {
        const moviesWithFutureScreenings = await screeningsModel.aggregate([
            {
                $match: {
                    screeningDate: { $gt: new Date() } 
                }
            },
            {
                $group: {
                    _id: '$movie' 
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
                    screeningDate: { $gt: new Date() } 
                }
            },
            {
                $group: {
                    _id: '$movie' 
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
        .sort({ _id: -1 }) 
        .limit(5) 
        .populate('genres', 'name') 
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};