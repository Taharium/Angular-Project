const mongoose = require('mongoose');

const highscoreSchema = new mongoose.Schema({
    highscore: {type: Number, trim: true, default: '0'},
    username: {type: String, trim: true, default: '', required: true},
    id: {type: String, trim: true, default: '', required: true},
    timestamp: {type: String, trim: true, default: new Date()}
});

module.exports = mongoose.model('Highscore', highscoreSchema);
