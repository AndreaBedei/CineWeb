exports.uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nessun file caricato.');
    }
    const path = req.file.path.replace(/\.[^/.]+$/, ".webp").split('\\')[2];
    
    res.status(200).json({
        message: 'Immagine caricata con successo!',
        imagePath: path,
    });
};
