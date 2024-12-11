const express = require('express');
const multer = require('multer');
const router = express.Router();
const controller = require('../controllers/imagesController');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

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
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.webp') {
        return next(); // Skip conversion if the file is already in WebP format
    }

    const outputFilePath = filePath.replace(/\.[^/.]+$/, ".webp");

    sharp(filePath)
        .webp()
        .toFile(outputFilePath, (err) => {
            if (err) {
                return next(err);
            }
            // Keep the original file
            req.file.webpPath = outputFilePath;
            next();
        });
};

router.route('/uploadposter').post(uploadPoster.single('image'), convertToWebp, controller.uploadImage);
router.route('/uploadprofile').post(uploadProfile.single('image'), convertToWebp, controller.uploadImage);
module.exports = router;