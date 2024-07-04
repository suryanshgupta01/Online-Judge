import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <Container
      maxWidth="sm"
      style={{ textAlign: 'center', marginTop: '10vh' }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom style={{ textAlign: 'center' }}>
        The page you are looking for might not be available, have been removed, had its name changed, or is temporarily unavailable.
      </Typography>
      <Box mt={4}>
        <Button variant="contained" color="primary" component={Link} to="/">
          Go to Homepage
        </Button>
      </Box>
    </Container>
  )
}

export default ErrorPage
