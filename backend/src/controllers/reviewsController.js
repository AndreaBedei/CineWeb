const { reviewsModel } = require('../models/reviewsModel');
const { usersModel } = require('../models/usersModel');
const { notificationsModel } = require('../models/notificationsModel');
const mongoose = require('mongoose');

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
        .populate({
            path: 'user',
            select: '-password -salt' 
        })
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
    const movieId = req.params.movieId;

    reviewsModel.find({ movie: movieId })
        .populate({
            path: 'user',
            select: '-password -salt' 
        })
        .limit(10) 
        .sort({ reviewDate: -1 }) 
        .then(docs => {
            if (docs.length === 0) {
                return res.status(200).send("");
            }
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

exports.createReview = (req, res) => {
    exports.createReview = async (req, res) => {
        try {
            const review = new reviewsModel(req.body);
            const savedReview = await review.save();
    
            const admins = await usersModel.find({ isAdmin: true }, '_id');
    
            if (admins.length > 0) {
                const notifications = admins.map(admin => ({
                    user: admin._id,
                    text: "Nuova recensione pubblicata! Premi qui per leggerla.",
                    resource: savedReview-movie
                }));
    
                await notificationsModel.insertMany(notifications);
            }
    
            res.status(201).json(savedReview);
        } catch (err) {
            res.status(500).send(err);
        }
    };
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
        { $match: { movie: mongoose.Types.ObjectId.createFromHexString(movieId)} }, 
        { $group: { 
            _id: "$movie", 
            averageRating: { $avg: "$rating" } 
        } }
    ])
    .then(result => {
        if (result.length === 0) {
            return res.json({ averageRating: "No Recensioni" });
        }
        return res.json({ averageRating: result[0].averageRating.toString() });
    })
    .catch(err => {
        res.status(500).send(err);
    });
};

exports.getReviewByUserAndMovie = (req, res) => {
    const userId = req.params.userId;
    const movieId = req.params.movieId;

    reviewsModel.findOne({ user: userId, movie: movieId })
        .then(doc => {
            if (!doc) {
                return res.status(200);
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};
