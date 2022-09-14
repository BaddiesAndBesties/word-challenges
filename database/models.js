const mongoose = require('mongoose');
const { model, Schema } = mongoose;

// Schema & Model
const gameSchema = new Schema({
    word: {
        type: String,
        required: true,
    },
    guess: {
        type: Array,
    },
});
const Game = model('Game', gameSchema);

const userSchema = new Schema({
    given_name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
    },
    point: {
        type: Number,
    },
    wins: {
        type: Number,
    },
    losses: {
        type: Number,
    },
    isPlaying: {
        type: Boolean,
    },
    game: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Game' }],
    },
});
const User = model('User', userSchema);

module.exports = { Game, User };
