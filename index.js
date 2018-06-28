const express = require('express');
const app = express();

// database configuration
const dbConfig = require('./config/dbconfig');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// connecting to the database
mongoose.connect(dbConfig.url)
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

// simple get
app.get('/', (req, res) => {
    res.json({"message": "Hello there!"});
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
