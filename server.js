const express = require('express');
const mongoose = require('mongoose')

const app = express();
const port = 8080 || process.env.PORT
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'))


mongoose.connect(process.env.url)
const dbConnection = mongoose.connection

dbConnection.once('open', () => {
    console.log('Database connected.');
});
dbConnection.on('error', (err) => {
    console.error('connection error: ', err);
});

app.listen(port, function() {
    console.log('listening on 8080')
  })
