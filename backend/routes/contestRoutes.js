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
            const newContest = new Contest(req.body);
            newContest.save();
            res.send('Contest created');
        }
        else {
            res.status(401).send('Unauthorized');
        }
    }
    catch (err) {
        console.log(err);
    }
})
module.exports = app;