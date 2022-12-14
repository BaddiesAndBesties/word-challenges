const mongoose = require('mongoose');
const { model, Schema } = mongoose;

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
    game: {
        type: Object,
        word: {
            type: String,
        },
    },
});
const User = model('User', userSchema);

module.exports = { User };
