const { usersModel } = require('../models/usersModel');
const crypto = require('crypto');

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
        .populate('favoriteGenres', 'name')
        .then(doc => {
            if (!doc) {
                return res.status(404).send('User not found');
            }
            doc.password = undefined;
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.createUser = async (req, res) => {
    req.body.isAdmin = false;
    req.body.salt = crypto.randomBytes(32).toString('hex');
    function isFutureDate(dateToCheck) {
        const today = new Date();
        const inputDate = new Date(dateToCheck);
        return inputDate.setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0);
    }

    if (isFutureDate(req.body.birthdate)) {
        return res.status(400).send('Birthdate cannot be in the future');
    }
    
    const newUser = new usersModel(req.body);
    newUser.save()
        .then(doc => {
            res.json(doc);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.updateUser = (req, res) => {
    // Assicurati che 'favoriteGenres' venga convertito da stringa JSON ad array
    if (req.body.favoriteGenres) {
      req.body.favoriteGenres = JSON.parse(req.body.favoriteGenres);
    }
    console.log(req.body);
  
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
  };

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

exports.findEmail = (req, res) => {
    const email = req.query.email; 

    usersModel.find()
        .where('email').equals(email)
        .then(docs => {
            docs.forEach(doc => {
                doc.password = undefined;
            });
            res.json(docs);
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.authenticateUser = (req, res) => {
    usersModel.find()
        .where('email').equals(req.query.email)
        .then(docs => {
            const user = docs[0];
            if (req.body.password === user.password) {
                res.json(user._id);
            } else {
                res.status(401).send('Password incorretta');
            }
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.authenticateUserById = (req, res) => {
    usersModel.findById(req.params.id)
        .then(user => {
            if (req.body.password === user.password) {
                res.json("Ok");
            } else {
                res.status(401).send('Password incorretta');
            }
        })
        .catch(err => {
            res.status(500).send(err);
        });
}

exports.getUserInterests = (req, res) => {
    usersModel.findById(req.params.id)
        .populate('favoriteGenres', 'name')
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.json(user.favoriteGenres); 
        })
        .catch(err => {
            res.status(500).send(err);
        });
};