exports.notificationsList = (req, res) => {
    notificationsModel.find()
        .populate('user', 'name email') 
        .sort({ timestamp: -1 }) 
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

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

exports.getUserNotifications = (req, res) => {
    notificationsModel.find({ user: req.params.userId })
        .populate('user', 'name email') 
        .sort({ timestamp: -1 }) 
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
};