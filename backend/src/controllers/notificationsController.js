const { notificationsModel } = require('../models/notificationsModel');
const { usersModel } = require('../models/usersModel');

// Elenco notifiche
exports.notificationsList = (req, res) => {
    notificationsModel.find()
        .populate('user', 'name email') // Mostra nome ed email dell'utente
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

// Creazione di una nuova notifica
exports.createNotification = (req, res) => {
    const newNotification = new notificationsModel(req.body);
    newNotification.save()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

// Aggiornamento di una notifica
exports.updateNotification = (req, res) => {
    notificationsModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Notification not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

// Eliminazione di una notifica
exports.deleteNotification = (req, res) => {
    notificationsModel.findByIdAndDelete(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('Notification not found');
            }
            res.json({ message: 'Notification deleted' });
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

// Notifiche di un utente specifico
exports.getUserNotifications = (req, res) => {
    notificationsModel.find({ user: req.params.userId })
        .populate('user', 'name email') // Mostra nome ed email dell'utente
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};
