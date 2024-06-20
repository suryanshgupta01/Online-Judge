const express = require('express');
const Contest = require('../models/contestModel');
const User = require('../models/userModel');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello contest');
});

app.post('/create', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send('Request body is missing');
        }
        const userAuth = await User.findOne({ userid: req.body.userid });
        if (userAuth && userAuth.isAdmin) {
            const newContest = new Contest({
                title: req.body.title,
                problems: req.body.problems,
                start_time: req.body.start_time,// "2019-04-28T14:45:15"
                duration: req.body.duration
            });
            newContest.save();
            res.send('Contest created');
        }
        else {
            res.status(401).send('Unauthorized');
        }
    }
    catch (err) {
        console.log("Failed to create contest");
    }
})

app.get('/contests', async (req, res) => {
    try {
        const contests = await Contest.find().populate('problems');
        res.send(contests);
    }
    catch (err) {
        console.log("Failed to get contests");
    }
})

app.get('/contest/:ID', async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.ID);
        res.send(contest);
    }
    catch (err) {
        console.log("failed geting contest by id");
    }
})

module.exports = app;