const express = require('express');
const router = express.Router();
const controller = require('../controllers/screeningsController');

router.route('/')
    .get(controller.screeningsList)
    .post(controller.createScreening);

router.route('/:id')
    .get(controller.getScreeningByID)
    .put(controller.updateScreening)
    .delete(controller.deleteScreening);

router.route('/movie/:movieId')
    .get(controller.findScreeningsByMovie);

router.route('/date')
    .get(controller.findScreeningsByDate);

router.route('/:screeningId/booked-seats')
    .get(controller.getBookedSeatsByScreening);

router.route('/cinemaHall/:cinemaHallId/date/:date')
    .get(controller.findScreeningsByCinemaHallAndDate);



module.exports = router;
