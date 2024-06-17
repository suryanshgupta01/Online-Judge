const express = require('express');
const app = express();
const User = require('../models/userModel');

app.get('/', (req, res) => {
    res.send('Hello user');
});

app.get('/profile/:ID', async (req, res) => {
    try {
        const id = req.params.ID;
        const details = await User.find({ name: id });
        if (!details || details.length === 0) {
            res.status(404).send('User not found');
        }
        res.send(JSON.stringify(details));
    } catch (err) {
        console.log(err);
    }
});

app.post('/register', (req, res) => {
    try {
        if (!req.body.userid || !req.body.email || !req.body.name) {
            return res.status(400).send('Information  is missing');
        }
        const newUser = new User(req.body);
        newUser.save();
        res.send(newUser);
    }
    catch (err) {
        console.log(err);
    }
});
module.exports = app;