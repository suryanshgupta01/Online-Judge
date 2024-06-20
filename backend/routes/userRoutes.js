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
            res.status(404).send({ "msg": "User not found" });
        }
        res.send(JSON.stringify(details));
    } catch (err) {
        console.log(err);
        console.log("error msg complete")
    }
});

app.post('/register', (req, res) => {
    try {
        if (!req.body.userid || !req.body.name) {
            return res.status(400).send('Information  is missing');
        }
        const oldUser = User.find({ userid: req.body.userid })
        if (oldUser) {
            return res.status(400).send('User already exists');
        }
        console.log(req.body)
        const newUser = new User(req.body);
        newUser.save();
        res.send(newUser);
    }
    catch (err) {
        console.log(err);
    }
});
module.exports = app;