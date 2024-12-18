const express = require('express');
const router = express.Router();
const controller = require('../controllers/cinemasController');

router.route('/')
    .get(controller.cinemaList)
    .post(controller.createCinema);

router.route('/cinema/:id')
    .get(controller.readCinema)
    .put(controller.updateCinema)
    .delete(controller.deleteCinema);

module.exports = router;
