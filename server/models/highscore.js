const mongoose = require('mongoose');

const highscoreSchema = new mongoose.Schema({
    highscore: {type: Number, trim: true, default: '0'},
});

module.exports = mongoose.model('Highscore', highscoreSchema);
