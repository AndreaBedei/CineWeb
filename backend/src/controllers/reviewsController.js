const { reviewsModel } = require('../models/reviewsModel');

exports.getAllReviews = (req, res) => {
    reviewsModel.find()
        .sort({ reviewDate: -1 }) 
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.getReviewsByRating = (req, res) => {
    reviewsModel.find()
        .sort({ rating: -1 }) 
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.getReviewsByUser = (req, res) => {
    const userId = req.params.userId;

    reviewsModel.find({ user: userId })
        .sort({ reviewDate: -1 }) 
        .then(docs => {
            if (docs.length === 0) {
                return res.status(404).send('No reviews found for this user');
            }
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.getReviewsByMovie = (req, res) => {
    const movieId = req.params.moviegId;

    reviewsModel.find({ movie: movieId })
        .sort({ reviewDate: -1 }) 
        .then(docs => {
            if (docs.length === 0) {
                return res.status(404).send('No reviews found for this movie');
            }
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.createReview = (req, res) => {
    const review = new reviewsModel(req.body);
    review.save()
        .then(doc => {
            res.status(201).json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.readReview = (req, res) => {
    reviewsModel.findById(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Review not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.updateReview = (req, res) => {
    reviewsModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Review not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.deleteReview = (req, res) => {
    reviewsModel.findByIdAndDelete(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Review not found');
            }
            res.json({ message: 'Review deleted' });
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.getAverageRatingByMovie = (req, res) => {
    const movieId = req.params.movieId;

    reviewsModel.aggregate([
        { $match: { movie: mongoose.Types.ObjectId(movieId) } }, 
        { $group: { 
            _id: "$movie", 
            averageRating: { $avg: "$rating" } 
        } }
    ])
    .then(result => {
        if (result.length === 0) {
            res.json({ averageRating: "/" });
        }
        res.json({ averageRating: result[0].averageRating });
    })
    .catch(err => {
        res.status(500).send(err);
    });
};

exports.getPastReservationsByUser = (req, res) => {
    const userId = req.params.userId;

    reservationsModel.find({
        user: userId,
        reservationDate: { $lt: Date.now() } 
    })
    .sort({ reservationDate: -1 }) 
    .then(docs => {
        if (docs.length === 0) {
            return res.status(404).send('No past reservations found for this user');
        }
        res.json(docs);
    })
    .catch(err => {
        res.status(500).send(err);
    });
};

exports.getFutureReservationsByUser = (req, res) => {
    const userId = req.params.userId;

    reservationsModel.find({
        user: userId,
        reservationDate: { $gt: Date.now() } 
    })
    .sort({ reservationDate: 1 }) 
    .then(docs => {
        if (docs.length === 0) {
            return res.status(404).send('No future reservations found for this user');
        }
        res.json(docs);
    })
    .catch(err => {
        res.status(500).send(err);
    });
};


