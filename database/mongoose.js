const mongoose = require('mongoose');
const { User } = require('./models');
const { ObjectID } = require('bson');
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
        .then(({ point, wins, losses, isPlaying }) => ({ point, wins, losses, isPlaying }))
);

const getCurrentGame = (id) => (
    User.findOne({
        _id: new ObjectId(id)
    })
        .then(({ game }) => ({ game }))
);

const startNewGame = (id, word) => {
    User.findOneAndUpdate({
        _id: new mongoose.Types.ObjectId(id)
    },
    {
        $set: {
            game: {
                word: word,
                guess: [],
            },
        }
    }, 
    {
        sort: {}, 
        upsert: false,
    }, 
    (err, result)=>{
        if (err) console.log(err)
    }
    )
}

const getTopScores = async () => {
    let scores = await User.find()
    scores.sort((score1, score2) => score1.point - score2.point)
    return scores.length <= 5 ? scores : scores.slice(5)
}

module.exports = { findUser, addUser, getStats, getCurrentGame, startNewGame, getTopScores};

