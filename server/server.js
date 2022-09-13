require('../database/mongoose'); // mongoose.js
require('dotenv').config();
const express = require('express');
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

app.post('/user-info', (req, res) => {
    const { jwtToken } = req.body;
    const { given_name, family_name, email, picture } = jwtDecoder(jwtToken);
    let id;

    if (given_name && family_name && email) {
        async function getWord () {
            let url = 'https://random-word-api.herokuapp.com/word';
            let response = await fetch(url);
            let responseText = await response.json();
            return responseText[0]; 
        };

        addUser(given_name, family_name, email, picture, getWord())
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log('Adding new user to database - FAILED');
                console.error(error);
            });
    }

    res.status(200);
    res.send(JSON.stringify({
            firstname: given_name,
            picture: picture,
            // Maybe return MongoDB ID
        }));
});

app.listen(port, () => {
    console.log(`listening on ${port}`);
});

//dictionary routers
app.post('/whatever-path-dennis-chooses', (req, res) => {
    const currentWord = getCurrentWord();
});