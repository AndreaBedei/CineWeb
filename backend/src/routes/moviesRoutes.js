const express = require('express');
const router = express.Router();
const controller = require('../controllers/moviesController');

router.route('/')
    .get(controller.moviesList)
    .post(controller.createMovie);

router.route('/:id')
    .get(controller.readMovie)
    .put(controller.updateMovie)
    .delete(controller.deleteMovie);

router.get('/available-movies', controller.availableMovies);

router.get('/movies/genre/:genreId', controller.availableMoviesByGenre);

module.exports = router;
