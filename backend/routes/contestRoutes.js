const express = require('express');
const Contest = require('../models/contestModel');
const User = require('../models/userModel');
const app = express();
const cron = require('node-cron');
const Problem = require('../models/problemModel');

function scheduleJob(cronPattern, assignmentContestScores, ...params) {
    const task = cron.schedule(cronPattern, async () => {
        await assignmentContestScores(...params);
        task.stop();
    });

    task.start();
}
const assignmentContestScores = async (contestID) => {
    const contest = await Contest.findById(contestID).populate('submissions')
    console.log("Processing contest submissions of contest", contest.title)
    const sublen = contest.submissions.length
    for (let i = 0; i < sublen; i++) {
        const userName = contest.submissions[i].userName
        const user = await User.findOne({ name: userName })
        if (user) {
            user.problems_submitted.push(contest.submissions[i]._id)
            await user.save()
        }
    }
    console.log("Processing leaderboard of contest", contest.title)
    const len = contest.leaderboard.length
    for (let i = 0; i < len; i++) {
        const user = await User.findOne({ name: contest.leaderboard[i].userName })
        let maxi = -1
        let ind = -1
        for (let j = 0; j < contest.problems.length; j++) {
            const problem = await Problem.findById(contest.problems[j])
            if (problem.rating > maxi && contest.leaderboard[i].isAccepted[j]) {
                maxi = problem.rating
                ind = j
            }
        }
        if (ind != -1) {
            contest.leaderboard[i].maxRating = contest.leaderboard[i].maxRating - ((contest.leaderboard[i].globalRank[ind] - 1) / contest.numSubmissions[i] * 50)
        }
        user.contest_rating = (contest.leaderboard[i].maxRating + (user.contest_participated || 0) * user.contest_rating) / ((user.contest_participated || 0) + 1)
        console.log((contest.leaderboard[i].maxRating + (user.contest_participated || 0) * user.contest_rating) / ((user.contest_participated || 0) + 1))
        user.contest_participated = (user.contest_participated || 0) + 1
        user.max_contest_rating = Math.max((user.max_contest_rating || 0), contest.leaderboard[i].maxRating)
        await user.save()
        await contest.save()
    }
}
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
            console.log(req.body.problems)
            const endTime = new Date(new Date(req.body.start_time).getTime() + req.body.duration * 60000)
            const cronPattern = `${endTime.getMinutes()} ${endTime.getHours()} ${endTime.getDate()} ${endTime.getMonth() + 1} *`;
            console.log(cronPattern)
            const newContest = new Contest({
                title: req.body.title,
                problems: req.body.problems,
                start_time: req.body.start_time,// "2019-04-28T14:45:15"
                duration: req.body.duration,
                correctSubmissions: new Array(req.body.problems.length).fill(0),
                numSubmissions: new Array(req.body.problems.length).fill(0),
                leaderboard: []
            });
            await newContest.save();

            scheduleJob(cronPattern, assignmentContestScores, newContest._id);
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
        const contests = await Contest.find().populate('problems').sort({ start_time: 1 });
        res.send(contests);
    }
    catch (err) {
        console.log("Failed to get contests");
    }
})

app.post('/getcontest', async (req, res) => {
    try {
        const contest = await Contest.findOne({ title: req.body.ID }).populate(['problems', 'submissions']);
        res.send(contest);
    }
    catch (err) {
        console.log("failed geting contest by id");
    }
})

module.exports = app;