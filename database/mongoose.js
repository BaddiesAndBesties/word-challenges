
const mongoose = require('mongoose');
const { User } = require('./models');

require('dotenv').config();

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB);
const dbConnection = mongoose.connection;

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

    console.log(word)

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
            word: JSON.stringify(word),
            guess: [],
        },
    })

    await newUser.save()
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