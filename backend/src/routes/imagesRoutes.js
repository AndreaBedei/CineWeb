const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controllers/imagesController');
const sharp = require('sharp');
const fs = require('fs');

// Configura Multer per salvare le immagini nella directory 'uploads'
const storagePoster = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './img/poster'); // Directory dove salvare le immagini
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nome univoco del file
    },
});

const storageProfile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './img/profile'); // Directory dove salvare le immagini
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nome univoco del file
    },
});

const uploadPoster = multer({ storage: storagePoster });
const uploadProfile = multer({ storage: storageProfile });

const convertToWebp = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    
    const filePath = req.file.path;
    const outputFilePath = filePath.replace(/\.[^/.]+$/, ".webp");
    
    sharp(filePath)
    .webp()
    .toFile(outputFilePath, (err) => {
        if (err) {
            return next(err);
        }
        // Delete the original file
        fs.unlink(filePath, (err) => {
            if (err) {
                return next(err);
            }
            req.file.path = outputFilePath;
            req.file.filename = req.file.filename.replace(/\.[^/.]+$/, ".webp");
            next();
        });
    });
};

router.route('/uploadposter').post(uploadPoster.single('image'), convertToWebp, controller.uploadImage);
router.route('/uploadprofile').post(uploadProfile.single('image'), convertToWebp, controller.uploadImage);
module.exports = router;