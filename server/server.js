require('../database/mongoose');
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
    updateGameResult } = require('../database/mongoose');
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
app.get('/user/:id/current-game', (req, res) => {
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
            res.status(200);
            res.send(JSON.stringify(scores));
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
        addUser(given_name, family_name, email, picture)
            .then((mongoId) => {
                res.status(201);
                res.send(JSON.stringify({
                    firstname: given_name,
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
            id: userInfo._id.toString(),
        }));
    }
});

// SOCKET.IO
const io = new Server(server, {
    cors: {
        origin: "https://word-challenges.herokuapp.com", // Use this when deploying to Heroku
        // origin: `http://localhost:3000`,
        methods: ["GET", "POST"],
    }
});

io.on('connection', (socket) => {
    let secretWord, placeholder, incorrectGuesses;

    // Return if user data in db already has a word, return that word
    // Otherwise, return a new word
    socket.on('newGame', async ({ id }) => { 
        if (id) {
            placeholder = [];
            incorrectGuesses = [];
            secretWord = await getCurrentGame(id)
                .then( async ({ game }) => {
                    if (game.word) {
                        return game.word.split('');
                    } else {
                        const newWord = await getNewWord();
                        startNewGame(id, newWord);
                        return newWord;
                    }
                })
                .catch((error) => {
                    console.log('Getting user game data - FAILED');
                    console.error(error);
                });
                for (let i = 0; i < secretWord.length; i++) {
                    placeholder.push('_');
                }
                socket.emit('newGame', { placeholder: placeholder });
        } else {
            console.log('Error - User DB ID was not provided');
        }
    });

    // Examine user guess and sned the data to be displayed accordingly
    // (e.g., number of incorrect guesses, remaining guesses, etc.).
    // If the game is over, send the game result, get a new random word, and update DB user data
    // (e.g., new word, user's number of wins/losses, etc.).
    socket.on('userGuess', async ({ letter, remainingGuess, id }) => {
        const guess = letter.toLowerCase();
        let prevIncorrectNum = incorrectGuesses.length;
        for (let i = 0; i < secretWord.length; i++) {
            if (incorrectGuesses.indexOf(guess) < 0 && secretWord.indexOf(guess) < 0) {
                incorrectGuesses.push(guess);
            }
            if (secretWord[i] === guess) {
                placeholder[i] = guess;
            }
        }
        if (prevIncorrectNum < incorrectGuesses.length) {
            remainingGuess--;
        }

        if (remainingGuess < 1) { // If remaining guess is smaller than 1, user loses
            const point = (0 - secretWord.length); // Deduct word-length amount of points if your lost
            updateGameResult(id, 0, 1, point)
                .catch((error) => {
                    console.log('Updating user stats - FAILED');
                    console.error(error);
                });
            const newWord = await getNewWord();
            startNewGame(id, newWord);
            socket.emit('gameOver', { userWon: false, secretWord: secretWord }); // Only send the secret word once the game is over

        } else if (placeholder.indexOf('_') < 0) { // If placeholder does not contain any placeholder user guess every letter (win)
            updateGameResult(id, 1, 0, secretWord.length)
                .catch((error) => {
                    console.log('Updating user stats - FAILED');
                    console.error(error);
                });
            const newWord = await getNewWord();
            startNewGame(id, newWord);
            socket.emit('gameOver', { userWon: true, secretWord: secretWord }); // Only send the secret word once the game is over

        } else { // Otherwise, the game is still not over and therefore send the data needed to display game status
            socket.emit('guessResult', { 
                placeholder: placeholder, 
                incorrect: incorrectGuesses, 
                remainingGuess: remainingGuess,
                wordLength: secretWord.length,
                id: id
            });
        }
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
                        reject('Random Word fetch FAILED - response length is 0 (invalid)');
                    }
                } catch (error) {
                    console.log('Random Word fetch FAILED');
                    reject(error);
                }
            });
        }).on('error', (error) => {
            console.error(error);
        });
    });
};
