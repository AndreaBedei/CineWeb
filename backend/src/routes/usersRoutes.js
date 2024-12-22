const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');

router.route('/')
    .get(controller.usersList)
    .post(controller.createUser);

router.route('/email')
    .get(controller.findEmail)
    .post(controller.authenticateUser);
    
router.route('/admins')
    .get(controller.findAdmins);
        
router.route("/users/users/:id/interests")
    .get(controller.getUserInterests);

router.route('/genre/:genreId')
    .get(controller.findUsersByGenre);

router.route('/:id')
    .get(controller.getUserByID)
    .post(controller.authenticateUserById)
    .put(controller.updateUser)
    .delete(controller.deleteUser);
    
module.exports = router;
