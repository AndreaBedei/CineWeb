const express = require('express');
const router = express.Router();
const controller = require('../controllers/moviesController');

router.route('/')
    .get(controller.moviesList)
    .post(controller.createMovie);

router.route('/movie/:id')
    .get(controller.readMovie)
    .put(controller.updateMovie)
    .delete(controller.deleteMovie);

router.route('/available')
    .get(controller.availableMovies);

router.route('/latest')
    .get(controller.latestMovies);


router.route('/genre/:genreId')
    .get(controller.availableMoviesByGenre);

router.route('/search/:title')
    .get(controller.searchMoviesByTitle);

module.exports = router;
