const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationsController');

router.route('/')
    .get(controller.notificationsList)
    .post(controller.createNotification);

router.route('/:id')
    .put(controller.updateNotification)
    .delete(controller.deleteNotification);

router.route('/user/:userId')
    .get(controller.getUserNotifications);

module.exports = router;
