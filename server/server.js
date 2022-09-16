require('../database/mongoose'); // mongoose.js
require('dotenv').config();
const express = require('express');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const cors = require("cors");
const jwtDecoder = require('./jwt');
const { findUser, addUser, getStats, getCurrentGame, startNewGame, getTopScores } = require('../database/mongoose');

const port = process.env.PORT || 8080;
const buildDir = path.join(__dirname, '..', 'client', 'build');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(buildDir)));

// GET REQUEST FOR GOOGLE CLIENT ID (USED WHEN SIGNING IN)
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

// GET REQUEST FOR TOP SCORES
app.get('/getTopScores', async (req, res) => {
    await getTopScores()
        .then((scores) => {
            res.status(200)
            res.send(JSON.stringify(scores))
        })
        .catch((error) => {
            res.sendStatus(500);
            console.error(error);
        });
})

app.get('*', (req, res) => {
    res.sendFile(path.join(buildDir + 'index.html'));
});

// POST REQUEST FOR NEW USER / RETURNS EXISTING DATA IF USER IS ALREADY IN THE DATABASE
app.post('/gsi', async (req, res) => {
    const { jwtToken } = req.body;
    const { given_name, family_name, email, picture } = jwtDecoder(jwtToken);

    if (!given_name || !family_name || !email) { // Invalid user if missing one of these info
        res.status(500);
        res.send('Invalid User');
    }

    const userInfo = await findUser(email) // Look up if the user already exists in the database (based on email)
        .then((doc) => doc) // Returns null if no matching document is found, otherwise returns a matching document
        .catch((error) => {
            console.log('Finding new user in database - FAILED');
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
                    id: mongoId,// Maybe return MongoDB ID to use as unique ID
                }));
            })
            .catch((error) => {
                res.status(500);
                res.send('DB Error');
                console.log('Adding new user to database - FAILED');
                console.error(error);
            });
    }

    if (userInfo) { // If the user email already exist in the database, send existing user info
        res.status(200);
        res.send(JSON.stringify({
            firstname: userInfo.given_name,
            email: userInfo.email,
            id: userInfo._id.toString(),
        }))
    }
});

// PUT REQUEST FOR NEW GAME
app.put('/user/:id/newGame', async (req, res) => {
    const { id } = req.params;
    const word = await getNewWord()
    startNewGame(id, word)
})


const server = app.listen(port, () => {
    console.log(`listening on ${port}`);
});

// SOCKET.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {
    console.log(`user connected: ${socket.id}`);

    let secretWord;
    let placeholderWord;
    let placeholders
    let incorrectGuesses = []

    socket.on('wordLength', async({ id }) => {
        if (id) {
            console.log('DB ID PROVIDED: ' + id);
            secretWord = await getCurrentGame(id)
                .then(({ game }) => game.word)
                .catch((error) => {
                    console.log('Getting user game data FAILED');
                    console.error(error);
                });
        socket.emit('wordLength', { length: secretWord.length });
        placeholderWord = '1'.repeat(secretWord.length).split('')
        placeholders = placeholderWord.filter( char => char === '1')
        }
    })
    socket.on('userGuess', async ({ letter }) => {
        const currIndexs = [...secretWord.matchAll(new RegExp(letter, 'gi'))].map(a => a.index);
        console.log(currIndexs)
        for (let i = 0; i < currIndexs.length; i++) {
            placeholderWord[currIndexs[i]] = letter
            console.log(placeholderWord)
        }
        let temp = placeholderWord.filter(char => char === '1')
        if (placeholders.length === temp.length){
            incorrectGuesses.push(letter)
        } else{
            placeholders = temp
        }
        socket.emit('guessResult', { result: placeholderWord, incorrect: incorrectGuesses });
    });

});


io.on('disconnet', () => {
    console.log('socket disconnected');
})

// GET NEW WORD FROM API
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
                        resolve(response[0])
                    } else {
                        reject('word fetch failed - response length is 0 (invalid)')
                    }
                } catch (error) {
                    console.log('word fetch failed')
                    reject(error)
                }

            });
        }).on('error', (error) => {
            console.error(error);
        });
    })
}
