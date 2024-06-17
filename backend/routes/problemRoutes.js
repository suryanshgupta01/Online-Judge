const express = require('express');
const app = express();
const Problem = require('../models/problemModel')

app.get('/', (req, res) => {
    res.send('Hello problem');
});
app.post('/create', (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send('Request body is missing');
        }
        const newProb = new Problem(req.body);
        newProb.save();
        res.send('Problem created');
    }
    catch (err) {
        console.log(err);
    }
});
app.get('/problemset', async (req, res) => {
    try {
        const allproblems = await Problem.find({ 'hidden': false });
        res.send(JSON.stringify(allproblems));
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/problem/:ID', async (req, res) => {
    try {
        const id = req.params.ID;
        const details = await Problem.find({ 'hidden': false });
        if (!details || details.length === 0 || id <= 0 || id > details.length) {
            res.status(404).send('Problem not found');
        }
        res.send(JSON.stringify(details[id - 1]));
    } catch (err) {
        console.log(err);
    }
});
module.exports = app;