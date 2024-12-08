const express = require('express');
const router = express.Router();
const controller = require('../controllers/genresController');

router.route('/')
    .get(controller.genresList)
    
module.exports = router;
