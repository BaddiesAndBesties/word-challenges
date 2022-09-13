require('../database/mongoose'); // mongoose.js
require('dotenv').config();
const express = require('express');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const jwtDecoder = require('./jwt');
const { addUser, getCurrentWord } = require('../database/mongoose');

const port = process.env.PORT || 8080;
const publicDir = path.join(__dirname, '..', 'client', 'public', '/');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicDir));

// google Routers
app.get('/google-client', (req, res) => {
    console.log('Google Client ID requested');
    res.status(200);
    res.send(process.env.GOOGLE_CLIENT_ID);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir + 'index.html'));
});

app.post('/user-info', async (req, res) => {
    const { jwtToken } = req.body;
    const { given_name, family_name, email, picture } = jwtDecoder(jwtToken);

    if (!given_name || !family_name || !email) {
        res.status(500);
        res.send('Invalid User');
    }
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
            res.status(200);
            res.send(JSON.stringify({
                firstname: given_name,
                picture: picture,
                // id: mongoId,// Maybe return MongoDB ID to use as unique ID
            }));
        })
        .catch((error) => {
            res.status(500);
            res.send('DB Error');
            console.log('Adding new user to database - FAILED');
            console.error(error);
        });
});

app.listen(port, () => {
    console.log(`listening on ${port}`);
});

//dictionary routers
app.post('/whatever-path-dennis-chooses', (req, res) => {
    const currentWord = getCurrentWord();
});