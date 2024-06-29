import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import React, { useState, useEffect, useContext } from 'react'
import { useUserContext } from '../useCustomContext'
const baseURL = import.meta.env.VITE_baseURL

function ForgotPassword() {
    const { resetPassword } = useUserContext()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [successmessage, setSuccessMessage] = useState('')
    const [errormessage, setErrorMessage] = useState('')
    const handleSubmit = async () => {
        if (email === '') { return setErrorMessage("Please enter your email") }
        setSuccessMessage("Please check your inbox for further instructions")
        await resetPassword(email)
    }
    const defaultTheme = createTheme();
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
                            Reset Password
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
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

                            {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                                <Alert
                                    onClose={handleClose}
                                    severity="success"
                                    variant="filled"
                                    sx={{ width: '100%' }}
                                >
                                    This is a success Alert inside a Snackbar!
                                </Alert>
                            </Snackbar> */}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={handleSubmit}
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Reset Password
                            </Button>


                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>



        </>
    )
}

export default ForgotPassword
