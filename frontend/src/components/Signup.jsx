import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
// import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
const defaultTheme = createTheme();

import React, { useEffect, useState, useContext } from 'react'
import { useUserContext } from '../useCustomContext'
import { auth } from '../firebase'
import { GoogleAuthProvider, signInWithRedirect, GithubAuthProvider, browserPopupRedirectResolver, getRedirectResult } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
const baseURL = import.meta.env.VITE_baseURL

const Signup = () => {
    const { currentUser, login, signup, logout, handleGoogle, handleGithub, handleMicrosoft, handleTwitter, handleFacebook } = useUserContext()
    const [name1, setName1] = useState('')
    const [email, setEmail] = useState(localStorage.getItem('email')||'')
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [successmessage, setSuccessMessage] = useState('')
    const [errormessage, setErrorMessage] = useState('')
    if (currentUser) {
        navigate('/')
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setErrorMessage('')
            localStorage.setItem('email', email)
            await signup(name1, email, password)
            setSuccessMessage("User created successfully")
            setTimeout(() => {
                navigate('/')
            }, 2000)
        } catch (err) {
            setErrorMessage("Something bad has happened")
            console.log(err)
        }
    }
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        getRedirectResult(auth).then(response => {
            if (!response) return
        }).catch(error => {
            console.error(error);
        }).finally(() => setIsLoading(false))
    }, []);

    const handleGoogle1 = async () => {
        const provider = new GoogleAuthProvider()
        signInWithRedirect(auth, provider, browserPopupRedirectResolver).catch(error => {
            console.error(error);
        })
    }
    const handleGithub1 = async () => {
        const provider = new GithubAuthProvider()
        signInWithRedirect(auth, provider, browserPopupRedirectResolver).catch(error => {
            console.error(error);
        })
    }

    return (
        <> <ThemeProvider theme={defaultTheme}>
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
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
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
                                    id="firstName"
                                    label="UserName"
                                    autoFocus
                                    onChange={(e) => setName1(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    defaultValue={email}
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>

                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to="/signin" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container display='flex' justifyContent='space-between' alignItems='center'>
                            <Button disabled={isLoading} onClick={() => handleGoogle()} variant="contained" color="error"><GoogleIcon /></Button>
                            <Button disabled={isLoading} onClick={() => handleMicrosoft()} variant="contained" color="success"><MicrosoftIcon /></Button>
                            <Button disabled={isLoading} onClick={() => handleGithub()} variant="contained" style={{ backgroundColor: 'black', height: '2.3rem' }}><i style={{ fontSize: '1.4rem' }} class="bi bi-github"></i></Button>
                            <Button disabled={isLoading} onClick={() => handleTwitter()} variant="contained"><TwitterIcon /></Button>
                        </Grid>

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
            <div>
                {/* 
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name1">Name</label>

                    <input type="text" id='name1' value={name1} onChange={(e) => setName1(e.target.value)} />
                    <label htmlFor="email">Email</label>
                    <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="password">Password</label>
                    <input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type='submit'>Submit</button>
                    <button disabled={isLoading} onClick={() => handleGoogle1()}>Google</button>
                    <button disabled={isLoading} onClick={() => handleGithub1()}>Github</button>
                    <button disabled={isLoading} onClick={() => handleMicrosoft()}>Microsoft</button>
                    <button disabled={isLoading} onClick={() => handleTwitter()}>Twitter</button>
                    <button disabled={isLoading} onClick={() => logout()}>LOGOUT</button>
                </form>
            */}
            </div>

        </>
    )
}
export default Signup