const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.URL);

const dbConnection = mongoose.connection;

dbConnection.once('open', () => {
    console.log('Database connected.');
});

dbConnection.on('error', (err) => {
    console.error('connection error: ', err);
});