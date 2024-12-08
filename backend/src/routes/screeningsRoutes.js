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

module.exports = router;
