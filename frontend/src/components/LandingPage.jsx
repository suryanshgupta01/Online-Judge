import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, useMediaQuery } from "@mui/material";
import Navbar from "./Navbar";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import GithubIcon from '@mui/icons-material/Github';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import { GoogleAuthProvider, signInWithRedirect, GithubAuthProvider, browserPopupRedirectResolver, getRedirectResult } from 'firebase/auth'
import { useUserContext } from '../useCustomContext';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const isNonMobileScreens = useMediaQuery("(min-width: 1224px)");
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const { currentUser, login, deleteUser, signup, logout, handleGoogle, handleGithub, handleMicrosoft, handleTwitter, handleFacebook } = useUserContext()
  const defaultTheme = createTheme();
  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem('email', email)
    navigate('/signup')
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
    <div className='makerow' style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
      <div style={{ width: '50vw', height: '95vh', textAlign: 'center', backgroundColor: '#e2e6ff', display: 'flex', alignItems: 'center' }}>

        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >

              <span style={{ fontSize: '3.5rem', fontWeight: 'bold', textAlign: 'left' }} >Put your skills to the test</span>
              <span style={{ fontSize: '1.2rem', textAlign: 'left' }} >
                We are here to help you to test your skills and get ready for the interview
              </span>
              {!currentUser ? 
              <Box component="form" noValidate sx={{ mt: 1 }}>
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


                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{ mt: 3, mb: 2 }}
                >
                  Start Solving
                </Button>

                <Grid container display='flex' justifyContent='space-around' alignItems='center'>
                  <Button disabled={isLoading} onClick={() => handleGoogle1()} variant="contained" color="error"><GoogleIcon /></Button>
                  <Button disabled={isLoading} onClick={() => handleMicrosoft()} variant="contained" color="success"><MicrosoftIcon /></Button>
                  <Button disabled={isLoading} onClick={() => handleGithub1()} variant="contained" style={{ backgroundColor: 'black' }}><GithubIcon /></Button>
                  <Button disabled={isLoading} onClick={() => handleTwitter()} variant="contained"><TwitterIcon /></Button>
                </Grid>

              </Box>
              :null}
            </Box>
          </Container>
        </ThemeProvider>

      </div>
      <div style={{ width: '50vw', height: '95vh', backgroundColor: '#e2e6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="https://static.vecteezy.com/system/resources/previews/005/310/113/non_2x/man-standing-with-a-laptop-vector.jpg"
          alt="freelance-operator-working-at-computer-flat-design-illustration-vector" width="80%" />
      </div>
      {/* <Link to="/signin">sighin</Link> */}
    </div>
  )
}

export default LandingPage
