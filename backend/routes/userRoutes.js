const express = require('express');
const app = express();
const User = require('../models/userModel');

app.get('/', (req, res) => {
    res.send('Hello user');
});

app.get('/profile/:ID', async (req, res) => {
    console.log("in profile/id API")
    try {
        const id = req.params.ID;
        console.log(id)
        const details = await User.findOne({ name: id });
        if (!details || details.length == 0) {
            console.log("nothing found")
            return res.status(404).send({ "msg": "User not found" });
        }
        console.log(details)
        return res.send(details);
    } catch (error) {
        console.error('Error fetching user by name:', error);
    }
});
const makeusername = (email, name) => {
    const random = Math.floor(Math.random() * 9000) + 1000;
    if (!name)
        return email.split('@')[0] + random.toString()
    const names = name.split(' ')[0] + random.toString()
    return names
}

app.post('/register', async (req, res) => {
    console.log("in register API")
    try {
        const { userid, name } = req.body;
        if (!userid || !name) {
            return res.status(400).send('Information is missing');
        }

        // Check if the user already exists
        const oldUser = await User.findOne({ userid });
        if (oldUser) {
            return res.status(400).send('User already exists');
        }

        // Create a new user
        const newUser = new User(req.body);
        await newUser.save();

        return res.send(newUser);
    } catch (err) {
        console.error("Error creating user in my database:", err);
        return res.status(500).send('Internal Server Error');
    }
});

app.post('/userinfo', async (req, res) => {
    try {
        const id = req.body.uid;
        const user = await User.findOne({ userid: id });
        return res.send(user);
    } catch (err) {
        console.error("Error fetching user info:", err);
        return res.status(500).send('Internal Server Error');
    }
})

app.put('/changeinfo', async (req, res) => {
    try {
        const { name, email, userid } = req.body
        const user = await User.findOne({ userid })
        if (!user)
            return res.status(404).send("User not found")
        const userpresent = await User.findOne({ name })
        if (userpresent)
            return res.status(404).send("User already exists")
        user.name = name
        user.email = email
        await user.save()
        return res.send(user)
    } catch (err) {
        console.error("Error changing user info:", err);
        return res.status(500).send('Internal Server Error');
    }
})
module.exports = app;