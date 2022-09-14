const mongoose = require('mongoose');
const { Game, User } = require('./models');
require('dotenv').config();

mongoose.connect(process.env.MONGODB);

const dbConnection = mongoose.connection;

dbConnection.once('open', () => {
    console.log('Database connected.');
});

dbConnection.on('error', (err) => {
    console.error('connection error: ', err);
});

const addUser = (givenName, lastname, email, picture, word) => {
    const newGame = new Game({
        word: word,
        guess: [],
    });

    const newUser = new User({
        given_name: givenName,
        lastname: lastname,
        email: email,
        picture: picture,
        point: 0,
        wins: 0,
        losses: 0,
        isPlaying: true,
        game: newGame,
    })

    return newUser.save()
        .then((res) => res._id.toString());
};

const getCurrentWord = () => {
    // get the word for the current game
};

module.exports = { addUser, getCurrentWord };