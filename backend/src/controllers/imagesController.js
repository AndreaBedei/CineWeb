exports.uploadImage = (req, res) => {
    const path = req.file.path;
    if (!req.file) {
        return res.status(400).send('Nessun file caricato.');
    }
    
    res.status(200).json({
        message: 'Immagine caricata con successo!',
        imagePath: path,
    });
};
