const express = require('express');
const router = express.Router();
const controller = require('../controllers/movieController');

router.route('/')
    .get(controller.listMovies)
    .post(controller.createMovie);

router.route('/:id')
    .get(controller.readMovie)
    .put(controller.updateMovie)
    .delete(controller.deleteMovie);

router.route('/search')
    .get(controller.findMoviesByActorAndYearRange);

module.exports = router;
