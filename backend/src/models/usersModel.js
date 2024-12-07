const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    surname: String,
    birthdate: Date,
    email: String,
    password: String,
    admin: Boolean
});

const userModel = mongoose.model('User', userSchema);

module.exports = { userModel }