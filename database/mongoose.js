const mongoose = require('mongoose');
const { User } = require('./models');
require('dotenv').config();

mongoose.connect(process.env.MONGODB);
const db = mongoose.connection;
const ObjectId = mongoose.Types.ObjectId;

db.once('open', () => {
    console.log('Database connected.');
});

db.on('error', (err) => {
    console.error('connection error: ', err);
});

const findUser = (email) => (
    User.findOne({
        email: email,
    })
);

const addUser = (givenName, lastname, email, picture, word) => {
    const newUser = new User({
        given_name: givenName,
        lastname: lastname,
        email: email,
        picture: picture,
        point: 0,
        wins: 0,
        losses: 0,
        isPlaying: true,
        game: {
            word: word,
            guess: [],
        },
    });

    return newUser.save()
        .then((res) => res._id.toString());
};

const getStats = (id) => (
    User.findOne({
        _id: new ObjectId(id)
    })
        .then(({ point, wins, losses }) => ({ point, wins, losses }))
);

const getCurrentWord = () => {
    // get the word for the current game
};

module.exports = { findUser, addUser, getStats, getCurrentWord };