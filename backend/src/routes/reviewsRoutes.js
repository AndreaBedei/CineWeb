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

router.route('/top-rated')
    .get(controller.getReviewsByRating);

router.route('/user/:userId')
    .get(controller.getReviewsByUser);

router.route('/screening/:screeningId')
    .get(controller.getReviewsByScreening);

module.exports = router;
