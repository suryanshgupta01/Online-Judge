import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import GitHubIcon from '@mui/icons-material/Github';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import React, { useState, useEffect, useContext } from 'react'
import { useUserContext } from '../useCustomContext'
import { auth } from '../firebase'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleAuthProvider, signInWithRedirect, GithubAuthProvider, browserPopupRedirectResolver, getRedirectResult } from 'firebase/auth'
const baseURL = 'http://localhost:4000'

const Signin = () => {
    const { currentUser, login, deleteUser, signup, logout, handleGoogle, handleGithub, handleMicrosoft, handleTwitter, handleFacebook } = useUserContext()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [successmessage, setSuccessMessage] = useState('')
    const [errormessage, setErrorMessage] = useState('')
    const defaultTheme = createTheme();
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setErrorMessage('')
            await login(email, password)
            setSuccessMessage("User logged in successfully")
            setTimeout(() => {
                navigate('/')
            }, 2000)
        } catch (err) {
            setErrorMessage("Invalid Creditentials")
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
        await signInWithRedirect(auth, provider, browserPopupRedirectResolver).catch(error => {
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
        <>

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
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            {successmessage && <Alert variant="filled" severity="success">
                                {successmessage}
                            </Alert>}
                            {errormessage && <Alert variant="filled" severity="error">
                                {errormessage}
                            </Alert>}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Grid container>
                                <Grid item xs>
                                    <Link to="/forgot-password" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link to="/signup" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={isLoading}
                                onClick={() => handleSubmit()}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container display='flex' justifyContent='space-around' alignItems='center'>
                                <Button disabled={isLoading} onClick={() => handleGoogle1()} variant="contained" color="error"><GoogleIcon /></Button>
                                <Button disabled={isLoading} onClick={() => handleMicrosoft()} variant="contained" color="success"><MicrosoftIcon /></Button>
                                <Button disabled={isLoading} onClick={() => handleGithub1()} variant="contained" style={{ backgroundColor: 'black' }}><GitHubIcon /></Button>
                                <Button disabled={isLoading} onClick={() => handleTwitter()} variant="contained"><TwitterIcon /></Button>
                            </Grid>

                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>

            <div>

                {/* 
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="password">Password</label>
                    <input type="password" id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type='submit'>Submit</button>
                    <i className="cross fa fa-times" style={{ fontSize: '40px' }} aria-hidden="true"></i>
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
export default Signin