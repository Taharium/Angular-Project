const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    company: {type: String, trim: true, default: 'FH Technikum Wien', required: true},
    street: {type: String, trim: true, default: ''},
    city: {type: String, trim: true, default: ''},
    postal: {type: String, trim: true, default: ''},
    username: {type: String, trim: true, default: '', required: true, unique: true},
    password: {type: String, trim: true, default: '', required: true},
    authToken: {type: String, trim: true, default: null},
});

module.exports = mongoose.model('User', userSchema);
