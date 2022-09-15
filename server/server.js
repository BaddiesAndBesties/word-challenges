require('../database/mongoose'); // mongoose.js
require('dotenv').config();
const express = require('express');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const jwtDecoder = require('./jwt');
const { findUser, addUser, getStats, getCurrentWord } = require('../database/mongoose');

const port = process.env.PORT || 8080;
const publicDir = path.join(__dirname, '..', 'client', 'public', '/');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicDir));

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

app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir + 'index.html'));
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
        const randomWordUrl = 'https://random-word-api.herokuapp.com/word';
        const word = await https.get(randomWordUrl, (res) => {
            let data = [];
            res.on('data', (chunk) => {
                data.push(chunk);
            });
            res.on('end', () => {
                const response = JSON.parse(Buffer.concat(data).toString());
                return response[0];
            });
        }).on('error', (error) => {
            console.error(error);
        });
    
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

const server = app.listen(port, () => {
    console.log(`listening on ${port}`);
});

// DICTIONARY ROUTE
app.post('/whatever-path-dennis-chooses', (req, res) => {
    const currentWord = getCurrentWord();
});

// SOCKET.IO
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
// const server = https.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})
io.on("connection", (socket) => {
    console.log(`user connected: ${socket.id}`)

    socket.on('joinRoom', (data) => {
        socket.join(data)
    })

    socket.on('guessedLetter', (data) => {
        console.log(data.letter, 'room: ' + data.room,)
        socket.to(data.room).emit('gameData', {game: 'who are you'})
    })
})

