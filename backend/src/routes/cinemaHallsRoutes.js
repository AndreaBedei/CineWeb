const express = require('express');
const router = express.Router();
const controller = require('../controllers/cinemaHallsController');

router.route('/')
    .get(controller.cinemaHallsList)
    .post(controller.createCinemaHall);

router.route('/:id')
    .get(controller.getCinemaHallFromID)
    .put(controller.updateCinemaHall)
    .delete(controller.deleteCinemaHall);

router.get('/cinemaHalls/cinema/:cinema', controller.getCinemaHallsByCinema);

module.exports = router;
