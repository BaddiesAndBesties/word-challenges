require('../database/mongoose'); // mongoose.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwtDecoder = require('./jwt');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '..', 'client', 'public', '/');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicDir));

// Routers
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
    const response = jwtDecoder(jwtToken);

    res.status(200);
    res.send(JSON.stringify({
            firstname: response.given_name,
            picture: response.picture
        }));
});

app.listen(port, () => {
    console.log(`listening on ${port}`);
});
