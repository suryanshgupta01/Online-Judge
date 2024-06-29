import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { useUserContext } from '../useCustomContext';

const baseURL = import.meta.env.VITE_baseURL
function Admin() {
    const { currentUser } = useUserContext()
    const [title, setTitle] = useState('')
    const [question, setQuestion] = useState('')
    const [constraints, setConstraints] = useState('')
    const [solved_TC_input, setSolvedTCInput] = useState('')
    const [solved_TC_output, setSolvedTCOutput] = useState('')
    const [allTC, setAllTC] = useState('')
    const [allCorrectSoln, setAllCorrectSoln] = useState('')
    const [rating, setRating] = useState('')
    const [inputFormat, setInputFormat] = useState('')
    const [outputFormat, setOutputFormat] = useState('')
    const [contestErrorMsg, setContestErrorMsg] = useState('')
    const [contestSuccessMsg, setcontestSuccessMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [isContest, setisContest] = useState(false)
    const [contestProblemIdarr, setContestProblemIdarr] = useState([])
    const [contestTitle, setContestTitle] = useState('')
    const [startDate, setStartDate] = useState('')
    console.log(startDate)
    const [duration, setDuration] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
        const allTCarr = allTC.split('\n\n')
        const allCorrectSolnArr = allCorrectSoln.split('\n\n')
        setSuccessMsg('')
        setErrorMsg('')
        if (isContest && (!duration || !startDate)) {
            setErrorMsg("Duration and start date is required")
            return
        }
        axios.post(`${baseURL}/problem/create`, {
            userid: currentUser.uid, title, availableFrom: isContest ? startDate : new Date(), duration: isContest ? duration : -1, question, constraints, solved_TC_input, solved_TC_output,
            allTCarr, allCorrectSolnArr, rating, inputFormat, outputFormat, submitted_by: []
        })
            .then((res) => {
                if (isContest) {
                    setContestProblemIdarr((prev) => [...prev, res.data._id])
                }
                console.log(res.data)
                setSuccessMsg('Problem created successfully')
                setTitle('')
                setQuestion('')
                setConstraints('')
                setSolvedTCInput('')
                setSolvedTCOutput('')
                setAllTC('')
                setAllCorrectSoln('')
                setRating('')
                setInputFormat('')
                setOutputFormat('')
            })
            .catch((err) => {
                console.log(err)
                setErrorMsg('Error creating problem')
            })
        console.log(title, question, constraints, solved_TC_input, solved_TC_output, allTCarr, allCorrectSolnArr, rating, inputFormat, outputFormat)
    }
    const handleContestSubmit = (e) => {
        if (title.trim() != '') {
            handleSubmit()
            return
        }
        e.preventDefault()
        setContestErrorMsg('')
        setcontestSuccessMsg('')
        if (contestProblemIdarr.length == 0) {
            setContestErrorMsg("No question are added")
            return
        }

        console.log(contestTitle, new Date(startDate), duration, contestProblemIdarr, currentUser.uid)
        axios.post(`${baseURL}/contest/create`, {
            title: contestTitle,
            start_time: new Date(startDate),
            duration: duration,
            problems: contestProblemIdarr,
            userid: currentUser.uid
        }).then((res) => {
            setcontestSuccessMsg('Contest created successfully')
            setContestTitle('')
            setStartDate(new Date())
            setDuration('')
            setContestProblemIdarr([])
        }).catch((err) => {
            console.log(err)
            setContestErrorMsg('Error creating contest')
        })
    }
    const [globalUser, setGlobalUser] = React.useState({})
    const baseURL = "https://online-judge-2.onrender.com"
    useEffect(() => {
        if (currentUser) {
            axios.post(`${baseURL}/user/userinfo`, {
                "uid": currentUser.uid
            }).then((res) => {
                setGlobalUser(res.data)
            })
        }
    }, [currentUser]);
    console.log(globalUser)
    if (globalUser && !globalUser.isAdmin) {
        return <>Access Denied</>
    }
    return (
        <div style={{ padding: '1rem' }}>
            <Box component="form" sx={{ mt: 1, marginRight: '4rem', marginLeft: '4rem', display: 'flex', flexDirection: 'column' }}>
                <h1>Create Contest</h1>
                {contestSuccessMsg && <Alert variant="filled" severity="success">
                    {contestSuccessMsg}
                </Alert>}
                {contestErrorMsg && <Alert variant="filled" severity="error">
                    {contestErrorMsg}
                </Alert>}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="contestTitle"
                    label="Contest Title"
                    name="contestTitle"
                    value={contestTitle}
                    autoComplete="contestTitle"
                    autoFocus
                    onChange={(e) => { setContestTitle(e.target.value); if (e.target.value.trim() != '') setisContest(true); else setisContest(false); }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="startDate"
                    label="Start Date and Time"
                    name="startDate"
                    type="datetime-local"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); if (new Date(e.target.value) < new Date()) { setContestErrorMsg("Past dates and times are not allowed"); } else setContestErrorMsg('') }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="duration"
                    label="Duration (in hours)"
                    name="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                />

            </Box>

            <Box>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, marginRight: '4rem', marginLeft: '4rem', display: 'flex', flexDirection: 'column' }}>
                    <h1>Set problem
                        {isContest ? `s of Contest ${contestTitle}` : null}
                    </h1>
                    {successMsg && <Alert variant="filled" severity="success">
                        {successMsg}
                    </Alert>}
                    {errorMsg && <Alert variant="filled" severity="error">
                        {errorMsg}
                    </Alert>}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '48%' }}>

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="title"
                                label="Problem Title"
                                name="title"
                                value={title}
                                autoComplete="title"
                                autoFocus
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="rating"
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                                label="Problem Rating"
                                id="rating"
                                type="number"
                            />
                        </Box>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            sx={{ width: '48%' }}

                            name="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            label="Problem Description"
                            id="question"
                            multiline
                            rows={4.5}
                        />
                    </Box>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="constraints"
                        value={constraints}
                        onChange={(e) => setConstraints(e.target.value)}
                        label="Constraints"
                        id="constraints"
                        multiline
                        rows={2}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <TextField
                            margin="normal"
                            required
                            sx={{ width: '48%' }}
                            name="solved_TC_input"
                            onChange={(e) => setSolvedTCInput(e.target.value)}
                            value={solved_TC_input}
                            label="Solved Test Case Input"
                            id="solved_TC_input"
                            multiline
                            rows={2}
                        />
                        <TextField
                            margin="normal"
                            required
                            sx={{ width: '48%' }}
                            name="solved_TC_output"
                            onChange={(e) => setSolvedTCOutput(e.target.value)}
                            value={solved_TC_output}
                            label="Solved Test Case Output"
                            id="solved_TC_output"
                            multiline
                            rows={2}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <TextField
                            margin="normal"
                            required
                            sx={{ width: '48%' }}
                            name="input_format"
                            onChange={(e) => setInputFormat(e.target.value)}
                            value={inputFormat}
                            label="Input Format"
                            id="input_format"
                            multiline
                            rows={2}
                        />
                        <TextField
                            margin="normal"
                            required
                            sx={{ width: '48%' }}
                            name="output_format"
                            onChange={(e) => setOutputFormat(e.target.value)}
                            value={outputFormat}
                            label="Output Format"
                            id="output_format"
                            multiline
                            rows={2}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <TextField
                            margin="normal"
                            required
                            sx={{ width: '48%' }}
                            name="all_TC"
                            onChange={(e) => setAllTC(e.target.value)}
                            value={allTC}
                            label="All Test Cases"
                            id="all_TC"
                            multiline
                            rows={3}
                        />
                        <TextField
                            margin="normal"
                            required
                            sx={{ width: '48%' }}
                            name="all_correct_soln"
                            onChange={(e) => setAllCorrectSoln(e.target.value)}
                            value={allCorrectSoln}
                            label="All Correct Solutions"
                            id="all_correct_soln"
                            multiline
                            rows={3}
                        />
                    </Box>
                    {!isContest ?
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Submit Problem
                        </Button>
                        :
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={handleContestSubmit}
                                sx={{ mt: 3, mb: 2, width: '48%', backgroundColor: 'green' }}
                            >
                                Submit contest
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{ mt: 3, mb: 2, width: '48%' }}
                            >
                                next Problem
                            </Button>
                        </Box>
                    }
                </Box>
            </Box>
        </div>
    )
}

export default Admin
