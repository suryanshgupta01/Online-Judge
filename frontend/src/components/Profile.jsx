import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useUserContext } from '../useCustomContext';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'
const baseURL = 'http://localhost:4000';
const Profile = () => {
    const { currentUser, deleteUser } = useUserContext()
    const navigate = useNavigate();
    const { name1 } = useParams();
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successmessage, setSuccessmessage] = useState('');
    const [errormessage, setErrormessage] = useState('');
    const [name2, setName2] = useState('');
    const [email2, setEmail2] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccessmessage('');
        setErrormessage('');
        axios.put(`${baseURL}/user/changeinfo`, { name: name2, email: email2, userid: currentUser.uid, profile_pic: user.profile_pic })
            .then(response => {
                setErrormessage('');
                console.log(response.data)
                setSuccessmessage('User information updated successfully');
                navigate(`/profile/${name2}`)
            })
            .catch(error => { setSuccessmessage(''); setErrormessage(error.message); });
    }
    const handleDelete = () => {
        const confirm = prompt("Are you sure you want to delete your account? This action cannot be undone.")
        setErrormessage('')
        setSuccessmessage('')
        console.log(user._id)
        if (confirm.toLocaleLowerCase() !== "yes") return;
        axios.post(`${baseURL}/user/deleteuser`,
            {
                "ID": user._id
            })
            .then(response => {
                console.log(response.data)
                setSuccessmessage('Account deleted successfully')
                setTimeout(() => {
                    navigate('/')
                }, 1000);
            })
            .catch(error => {
                setSuccessmessage('')
                setErrormessage("Signin again to delete accout")
                console.log(error)
            })

        deleteUser()
    }
    const handleFileChange = (event) => {
        const filereader = new FileReader()
        filereader.onload = () => {
            setUser({ ...user, profile_pic: filereader.result })
            console.log(filereader.result)
        }
        filereader.readAsDataURL(event.target.files[0])
    }
    const defaultTheme = createTheme()
    useEffect(() => {
        setIsLoading(true);
        axios.get(`${baseURL}/user/profile/${name1}`)
            .then(response => {
                if (response.msg)
                    alert(response.msg)
                else {
                    console.log(response.data.problems_submitted)
                    setUser(response.data);
                    setName2(response.data.name);
                    setEmail2(response.data.email);
                }
            })
            .catch(error => { console.error('Error fetching user data:', error); navigate('/User-not-found') });
        setIsLoading(false);
    }, [name1]);

    if (isLoading)
        return <div>Loading...</div>;
    return (
        <div>

            <Tabs>
                <TabList>
                    <Tab>Profile</Tab>
                    <Tab>Update profile</Tab>
                    <Tab>Submissions</Tab>

                </TabList>

                <TabPanel>
                    <div style={{ border: '2px solid black', padding: '2rem', borderRadius: '0.2rem', margin: '2rem' }}>
                        <div className='makerow'>
                            <div style={{ width: '90%' }}>
                                <h1>{user.name}</h1>
                                <p><img src="https://img.freepik.com/free-vector/business-success-growth-green-arrow-world-map_1017-45122.jpg?t=st=1719004907~exp=1719008507~hmac=90dc194f84f538887a5da2ccd3502848bc256c7807305ebfcb1ade981f5b2469&w=996"
                                    width="24px" />   Contest Rating: {user.contest_rating}</p>
                                <p><img src="https://img.freepik.com/free-vector/3d-cartoon-style-paper-with-green-tick-envelope-icon-open-envelope-with-approved-document-contract-agreement-flat-vector-illustration-paperwork-success-verification-concept_778687-1016.jpg"
                                    width="30px" style={{ backgroundBlendMode: 'color' }} />  Email: {user.email}</p>
                                <p><img src="https://img.freepik.com/free-vector/website-faq-section-user-help-desk-customer-support-frequently-asked-questions-problem-solution-quiz-game-confused-man-cartoon-character_335657-1602.jpg?t=st=1719003235~exp=1719006835~hmac=4ba23537109a2b490dd8094171407ac21aa1ae27245deece62f9f00c44cc9f6c&w=740"
                                    width="24px" />
                                    Problems Submitted: {user.problems_submitted?.length}</p>
                                <p>Admin Status: {user.isAdmin ? 'Yes' : 'No'}</p>
                                <p>Account created: {moment(currentUser?.metadata.creationTime).fromNow()}</p>
                            </div>
                            <div>
                                <img src={user.profile_pic} alt="Profile" style={{ width: '10rem', height: '10rem', right: '0' }} />
                            </div>
                        </div>

                    </div>
                </TabPanel>
                <TabPanel>
                    <ThemeProvider theme={defaultTheme}>
                        <Container component="main" maxWidth="xs">
                            <CssBaseline />
                            <Box
                                sx={{
                                    marginTop: 8,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                    <input type="file" id="file" onChange={(e) => handleFileChange(e)} style={{ display: 'none' }} accept="image/*" />
                                    <label htmlFor="file">
                                        <img src={user.profile_pic} alt="Profile" style={{ width: '48px', right: '0' }} />
                                    </label>
                                </Avatar>
                                <div style={{ position: 'relative', left: '5%', top: '-25px' }}>🖋️</div>
                                <Typography component="h1" variant="h5">
                                    Update profile
                                </Typography>
                                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                    {successmessage && <Alert variant="filled" severity="success">
                                        {successmessage}
                                    </Alert>}
                                    {errormessage && <Alert variant="filled" severity="error">
                                        {errormessage}
                                    </Alert>}
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} >
                                            <TextField
                                                autoComplete="given-name"
                                                name="firstName"
                                                required
                                                fullWidth
                                                defaultValue={name2}
                                                id="firstName"
                                                label="UserName"
                                                autoFocus
                                                onChange={(e) => setName2(e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                defaultValue={email2}
                                                id="email"
                                                label="Email Address"
                                                name="email"
                                                autoComplete="email"
                                                onChange={(e) => setEmail2(e.target.value)}
                                            />
                                        </Grid>


                                    </Grid>
                                    <Grid container justifyContent="flex-end">
                                        <Grid item>
                                            <div onClick={handleDelete} style={{ cursor: 'pointer', color: 'red' }}>
                                                Delete account
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Update user
                                    </Button>


                                </Box>
                            </Box>
                        </Container>
                    </ThemeProvider>
                </TabPanel>
                <TabPanel>
                    <table className="table table-hover table-dark" style={{ marginBottom: '2rem' }}>
                        <thead>
                            <tr>
                                <th scope="col">Problem</th>
                                <th scope="col">Submission Time</th>
                                <th scope="col">Title</th>
                                <th scope="col">Language</th>
                                <th scope="col">Verdict</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user?.problems_submitted?.map((problem) => (
                                <tr>
                                    <td>{problem.problem_id}</td>
                                    <td>{problem.submission_time}</td>
                                    <td>{problem.title}</td>
                                    <td>{problem.language}</td>
                                    <td>{problem.verdict}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TabPanel>

            </Tabs>
        </div>
    );
}

export default Profile;
