const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');

router.route('/')
    .get(controller.usersList)
    .post(controller.createUser);

router.route('/email')
    .get(controller.findEmail)
    .post(controller.authenticateUser);

router.route('/:id')
    .get(controller.getUserByID)
    .put(controller.updateUser)
    .delete(controller.deleteUser);

router.route('/admins')
    .get(controller.findAdmins)

router.get('/users/:id/interests', getUserInterests);

module.exports = router;
