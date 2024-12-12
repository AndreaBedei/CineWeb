const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservationsController');

router.route('/')
    .get(controller.reservationsList)
    .post(controller.createReservation);

router.route('/:id')
    .get(controller.getReservationByID)
    .put(controller.updateReservation)
    .delete(controller.deleteReservation);

router.route('/user/:userId')
    .get(controller.findReservationsByUser);

router.route('/user/:userId/past')
    .get(controller.getPastReservationsByUser);

router.route('/user/:userId/future')
    .get(controller.getFutureReservationsByUser);

router.route('/screening/:screeningId')
    .get(controller.findReservationsByScreening);

module.exports = router;
