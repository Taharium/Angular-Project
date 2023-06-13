const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    company: {type: String, trim: true, default: 'FH Technikum Wien'},
    street: {type: String, trim: true, default: ''},
    city: {type: String, trim: true, default: ''},
    postal: {type: String, trim: true, default: ''},
    username: {type: String, trim: true, default: ''},
    password: {type: String, trim: true, default: ''},
    authToken: {type: String, trim: true, default: ''},
});

module.exports = mongoose.model('User', userSchema);
