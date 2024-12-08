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

exports.getReviewsByScreening = (req, res) => {
    const screeningId = req.params.screeningId;

    reviewsModel.find({ screening: screeningId })
        .sort({ reviewDate: -1 }) 
        .then(docs => {
            if (docs.length === 0) {
                return res.status(404).send('No reviews found for this screening');
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
