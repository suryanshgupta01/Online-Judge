const express = require('express');
const app = express();
const Problem = require('../models/problemModel');
const User = require('../models/userModel');

app.get('/', (req, res) => {
    res.send('Hello problem');
});
app.post('/create', async (req, res) => {
    try {
        if (!req.body || !req.body.title || !req.body.question || !req.body.constraints || !req.body.solved_TC_input || !req.body.solved_TC_output || !req.body.allTCarr || !req.body.allCorrectSolnArr || !req.body.rating || !req.body.inputFormat || !req.body.outputFormat || !req.body.userid) {
            console.log(req.body)
            return res.status(400).send('Request body is missing');
        }
        const userAuth = await User.findOne({ userid: req.body.userid });
        if (!userAuth || !userAuth.isAdmin) {
            return res.status(401).send('Unauthorized');
        }
        const oldprob = await Problem.findOne({ title: req.body.title });
        if (oldprob) {
            return res.status(400).send('Problem already exists');
        }
        const newProb = new Problem({...req.body,author:userAuth.name});
        newProb.save();
        res.send(newProb);
    }
    catch (err) {
        console.log("Failed to create problem");
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
        console.log("Failed to delete problem");
    }
});


app.get('/problemset', async (req, res) => {
    try {
        const allproblems = await Problem.find({ 'hidden': false });
        res.send(JSON.stringify(allproblems));
    } catch (err) {
        console.log("Failed to get problemset");
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
        console.log("error updating problem");
    }
}
);

app.get('/problem/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const newtitle = title.split('-').join(' ');
        const details = await Problem.find({ 'title': newtitle });
        if (!details || details.length === 0) {
            res.status(404).send('Problem not found');
        }
        res.send(JSON.stringify(details[0]));
    } catch (err) {
        console.log("error getting problem by title");
    }
});
module.exports = app;