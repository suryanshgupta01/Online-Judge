const express = require('express');
const app = express();
const Problem = require('../models/problemModel');
const User = require('../models/userModel');

app.get('/', (req, res) => {
    res.send('Hello problem');
});
app.post('/create', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send('Request body is missing');
        }
        const userAuth = await User.findOne({ userid: req.body.userid });
        if (!userAuth || !userAuth.isAdmin) {
            return res.status(401).send('Unauthorized');
        }
        const newProb = new Problem(req.body);
        newProb.save();
        res.send('Problem created');
    }
    catch (err) {
        console.log(err);
    }
});

app.delete('/delete/:ID', async (req, res) => {

    try {
        const userAuth = await User.findOne({ userid: req.body.userid });
        if (!userAuth || !userAuth.isAdmin) {
            return res.status(401).send('Unauthorized');
        }
        const prob = await Problem.findByIdAndDelete(req.params.ID);
        res.send('Problem deleted');
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

app.put('/update/:ID', async (req, res) => {
    try {
        const userAuth = await User.findOne({ userid: req.body.userid });
        if (!userAuth || !userAuth.isAdmin) {
            return res.status(401).send('Unauthorized');
        }
        const prob = await Problem.findByIdAndUpdate(req.params.ID, req.body, { new: true });
        res.send('Problem updated');
    }
    catch (err) {
        console.log(err);
    }
}
);

app.get('/problem/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const details = await Problem.find({ 'title': title });
        if (!details || details.length === 0) {
            res.status(404).send('Problem not found');
        }
        res.send(JSON.stringify(details));
    } catch (err) {
        console.log(err);
    }
});
module.exports = app;