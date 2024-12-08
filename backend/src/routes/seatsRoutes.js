const express = require('express');
const router = express.Router();
const controller = require('../controllers/seatsController');

router.route('/')
    .get(controller.seatsList)
    .post(controller.createSeat);

router.route('/:id')
    .get(controller.readSeat)
    .put(controller.updateSeat)
    .delete(controller.deleteSeat);

router.route('/search')
    .get(controller.findSeatsByHall);

module.exports = router;
