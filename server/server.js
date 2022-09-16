require('../database/mongoose'); // mongoose.js
require('dotenv').config();
const express = require('express');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const cors = require("cors");
const jwtDecoder = require('./jwt');
const {
    findUser,
    addUser,
    getStats,
    getCurrentGame,
    getTopScores,
    startNewGame,
    updatePlayingStatus } = require('../database/mongoose');

const port = process.env.PORT || 8080;
const buildDir = path.join(__dirname, '..', 'client', 'build/');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(buildDir)));

const server = app.listen(port, () => {
    console.log(`listening on ${port}`);
});

// GET REQUEST FOR GOOGLE CLIENT ID (used when signin in)
app.get('/google-client', (req, res) => {
    res.status(200);
    res.send(process.env.GOOGLE_CLIENT_ID);
});

// GET REQUEST FOR USER STATS (e.g., number of wins/losses and points)
app.get('/user/:id/stats', (req, res) => {
    const { id } = req.params;
    getStats(id)
        .then((stats) => {
            res.status(200);
            res.send(JSON.stringify(stats));
        })
        .catch((error) => {
            res.sendStatus(500);
            console.log('Reading user stats in DB - FAILED');
            console.error(error);
        });
});

// GET REQUEST FOR CURRENT GAME (word and current guesses)
app.get('/user/:id/currentGame', (req, res) => {
    const { id } = req.params;
    getCurrentGame(id)
        .then((game) => {
            res.status(200);
            res.send(JSON.stringify(game));
        })
        .catch((error) => {
            res.sendStatus(500);
            console.error(error);
        });
});

// GET REQUEST FOR TOP 5 SCORERS
app.get('/leaderboard/top-five', (req, res) => {
    getTopScores()
        .then((scores) => {
            res.status(200)
            res.send(JSON.stringify(scores))
        })
        .catch((error) => {
            res.sendStatus(500);
            console.error(error);
        });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(buildDir + 'index.html'));
});

// POST REQUEST FOR NEW USER (returns existing user if the user is already in the db)
app.post('/gsi', async (req, res) => {
    const { jwtToken } = req.body; // JWT Token returned by Google Sign-In
    const { given_name, family_name, email, picture } = jwtDecoder(jwtToken);

    if (!given_name || !family_name || !email) { // Invalid user info check
        res.sendStatus(500);
        return;
    }

    const userInfo = await findUser(email) // Look up if the user already exists in the database (based on email)
        .then((doc) => doc) // Returns null if no matching document is found, otherwise returns a matching document
        .catch((error) => {
            console.log('Finding new user in DB - FAILED');
            console.error(error);
        });

    if (!userInfo) { // If the user email does NOT exist in the database, add it to the database
        const word = await getNewWord()

        addUser(given_name, family_name, email, picture, word)
            .then((mongoId) => {
                res.status(201);
                res.send(JSON.stringify({
                    firstname: given_name,
                    email: email,
                    id: mongoId,
                }));
            })
            .catch((error) => {
                res.status(500);
                res.send('DB Error');
                console.log('Adding new user to DB - FAILED');
                console.error(error);
            });
    }

    if (userInfo) { // If the user email already exist in the database, send exising user info
        res.status(200);
        res.send(JSON.stringify({
            firstname: userInfo.given_name,
            email: userInfo.email,
            id: userInfo._id.toString(),
        }));
    }
});

// PUT REQUEST FOR NEW GAME
// app.put('/user/:id/newGame', async (req, res) => {

// });

// PUT REQUEST FOR USER PLAYING STATUS
app.put('/user/:id/playingStatus', async (req, res) => {
    const { id } = req.params;
    updatePlayingStatus(id)
        .then(() => {
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log('Updating user playing status - FAILED');
            console.error(error);
            res.sendStatus(400);
        })
});

// SOCKET.IO
const io = new Server(server, {
    cors: {
        // origin: "https://word-challenges.herokuapp.com", // Use this when deployed to Herok
        origin: `http://localhost:3000`,
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {
    console.log(`user connected: ${socket.id}`);

    let secretWord;
    let placeholder = [];
    let incorrectGuesses = [];


    socket.on('placeholder', async ({ id }) => {
        console.log('before if', id)
        if (id) {
            console.log('after if')
            secretWord = await getCurrentGame(id)
                .then(({ game }) => {
                    console.log(game.word);
                    return game.word.split('');
                })
                .catch((error) => {
                    console.log('Getting user game data - FAILED');
                    console.error(error);
                });
            placeholder = []
            for (let i = 0; i < secretWord.length; i++) {
                placeholder.push('_');
            }

            socket.emit('placeholder', { placeholder: placeholder });
        }
    });

    socket.on('newGame', async ({ id }) => {
        console.log('something went wrong', {id})
        const newWord = await getNewWord()
        updatePlayingStatus(id)
        startNewGame(id, newWord)
    })

    socket.on('userGuess', ({ letter, remainingGuess }) => {
        let prevIncorrectNum = incorrectGuesses.length
        for (let i = 0; i < secretWord.length; i++) {
            if (incorrectGuesses.indexOf(letter) < 0 && secretWord.indexOf(letter) < 0) {
                incorrectGuesses.push(letter);
            }
            if (secretWord[i] === letter) {
                placeholder[i] = letter;
            }
        }
        console.log('PREV = ' + prevIncorrectNum);
        console.log('CURR = ' + incorrectGuesses.length);
        if (prevIncorrectNum < incorrectGuesses.length) {
            remainingGuess--;
        }
        socket.emit('guessResult', { placeholder: placeholder, incorrect: incorrectGuesses, remainingGuess: remainingGuess });
    });
});

io.on('disconnet', () => {
    console.log('socket disconnected');
});

// Get new word from an external API. (Returns a prmise)
const getNewWord = () => {
    const randomWordUrl = 'https://random-word-api.herokuapp.com/word';
    return new Promise((resolve, reject) => {
        https.get(randomWordUrl, (res) => {
            let data = [];
            res.on('data', (chunk) => {
                data.push(chunk);
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(Buffer.concat(data).toString());
                    if (response && response[0]) {
                        resolve(response[0]);
                    } else {
                        reject('word fetch failed - response length is 0 (invalid)');
                    }
                } catch (error) {
                    console.log('word fetch failed');
                    reject(error);
                }
            });
        }).on('error', (error) => {
            console.error(error);
        });
    });
};

