const express = require('express');
const app = express();
const Problem = require('../models/problemModel');
app.post('/run', (req, res) => {
    res.send('Compiling code...');
});


app.post('/submit', (req, res) => {
    res.send('SUbmitting code...');
});



module.exports = app;