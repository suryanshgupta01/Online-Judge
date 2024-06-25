const express = require('express');
const { createFilepath } = require('../createFilepath');
const User = require('../models/userModel');
const Problem = require('../models/problemModel');
const { executeCode } = require('../executeCode');
const Submission = require('../models/submissionModel');
const app = express();
const createSubmission = async (problem, problemName, user, code, language, verdict) => {
    const submission = new Submission({ problem, problemName, user, code, language, verdict })
    await submission.save()
    return submission._id
}
app.post('/run', async (req, res) => {
    try {
        const lang = req.body.lang;
        const code = req.body.code;
        const input = req.body.input;
        if (!req.body.lang || !req.body.code || !req.body.probID || !req.body.userID) {
            res.status(400).send('Information missing while running code');
        }
        const isSubmit = req.body.isSubmit || false
        const userinfo = await User.findOne({ userid: req.body.userID })
        if (!userinfo) {
            res.status(404).send('unauthorized user');
        }
        const problem = await Problem.findById(req.body.probID)
        if (!problem) {
            res.status(404).send('problem not found')
        }

        if (!isSubmit) {
            const { filePath, dirCodes } = await createFilepath(lang, code, userinfo.name)
            const answer = await executeCode(filePath, dirCodes, input, userinfo.name, lang)
            res.send({ answer });
        } else {
            const { filePath, dirCodes } = await createFilepath(lang, code, userinfo.name)
            const len = problem.allTCarr.length
            let pass = 0
            for (let i = 0; i < len; i++) {
                const input = problem.allTCarr[i]
                const output = problem.allCorrectSolnArr[i]
                const answer = await executeCode(filePath, dirCodes, input, userinfo.name, lang)
                console.log(input, output, answer)
                if (answer.trim() != output.trim()) {
                    problem.total_submissions = problem.total_submissions + 1
                    await problem.save()
                    const sub = await createSubmission(problem._id, problem.title, userinfo._id, code, lang, 'WA on TC ' + (pass + 1) + '\nWrong TestCase: \n' + problem.allTCarr[pass] + '\nYour output:\n' + answer + '\nCorrect output:\n' + output)
                    userinfo.problems_submitted.push(sub)
                    await userinfo.save()
                    return res.send({ wrongTC: problem.allTCarr[pass], Wooutput: answer, Coutput: output, pass, isCorrect: false });
                } else pass++
            }
            problem.total_accepted = problem.total_accepted + 1
            problem.total_submissions = problem.total_submissions + 1
            await problem.save()
            const sub = await createSubmission(problem._id, problem.title, userinfo._id, code, lang, 'AC')
            userinfo.problems_submitted.push(sub)
            await userinfo.save()
            return res.send({ isCorrect: true });
        }
    } catch (error) {
        return res.status(500).send(error.stderr);
    }
});

app.post('/profile', async (req, res) => {
    const user = await User.findOne({ userid: req.body.userID })
    if (!user) {
        return res.status(404).send('user not found')
    }
    const submissions = await Submission.find({ user: user._id })
    res.send(submissions)
})

//not used in this project
app.post('/mysubproblem', async (req, res) => {
    const user = await User.findOne({ userid: req.body.userID })
    if (!user) {
        return res.status(404).send('user not found')
    }
    const submissions = await Submission.find({ user: user._id })
    const mysub = submissions.filter((ele) => ele.problemName == req.body.problemName.split('-').join(' '))
    res.send(mysub)
})

app.post('/allsubproblem', async (req, res) => {
    const user = await User.findOne({ userid: req.body.userID })
    if (!user) {
        return res.status(404).send('user not found')
    }
    const submissions = await Submission.find({ problemName: req.body.problemName.split('-').join(' ') }).populate('user')
    res.send(submissions.reverse())
})


module.exports = app;