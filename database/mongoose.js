const { Game, User } = require('./models');
require('dotenv').config();

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB);
const dbConnection = mongoose.connection;

dbConnection.once('open', () => {
    console.log('Database connected.');
});

dbConnection.on('error', (err) => {
    console.error('connection error: ', err);
});

const addUser = async (givenName, lastname, email, picture, word) => {
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

    await newUser.save()
        .then((res) => res._id.toString());

};

const getCurrentWord = (word) => {
    // get the word for the current game
};

module.exports = { addUser, getCurrentWord };