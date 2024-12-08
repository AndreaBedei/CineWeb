const { usersModel } = require('../models/usersModel');

exports.usersList = (req, res) => {
    usersModel.find()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.send(err);
        });
}

exports.getUserByID = (req, res) => {
    usersModel.findById(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('User not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.createUser = (req, res) => {
    const newUser = new userModel(req.body);
    newUser.save()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.updateUser = (req, res) => {
    usersModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(doc => {
            if (!doc) {
                return res.status(404).send('User not found');
            }
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.deleteUser = (req, res) => {
    usersModel.findByIdAndDelete(req.params.id)
        .then(doc => {
            if (!doc) {
                return res.status(404).send('User not found');
            }
            res.json({ message: 'User deleted' });
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.findAdmins = (req, res) => {
    usersModel.find()
        .where('isAdmin').equals(true)
        .then(docs => {
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}
