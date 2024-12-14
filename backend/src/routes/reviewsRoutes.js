const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewsController');

router.route('/')
    .get(controller.getAllReviews)
    .post(controller.createReview);
    
    router.route('/:id')
    .get(controller.readReview)
    .put(controller.updateReview)
    .delete(controller.deleteReview);
    
router.route('/screening/:movieId')
    .get(controller.getReviewsByMovie);

router.route('/average-rating/:movieId')
    .get(controller.getAverageRatingByMovie);

router.route('/top-rated')
    .get(controller.getReviewsByRating);

router.route('/user/:userId/movie/:movieId')
    .get(controller.getReviewByUserAndMovie);

router.route('/user/:userId')
    .get(controller.getReviewsByUser);

module.exports = router;
