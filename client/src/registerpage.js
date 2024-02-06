import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const[lastName,setlastName]=useState('');

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const[lastNameError,setlastNameError]=useState('');
  const [error, setError] = useState(''); // State variable for error message
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    // Clear previous error messages
    setUsernameError('');
    setPasswordError('');
    setFirstNameError('');
    setlastNameError('');
    setError('');

    setLoading(true); // Enable loading state


    if (!username) {
      setUsernameError('Email is required');
      setLoading(false); // Disable loading state

      return;
    }

    if (!password) {
      setPasswordError('Password is required');
      setLoading(false); // Disable loading state

      return;
    }

    if (!firstName) {
      setFirstNameError('First Name is required');
      setLoading(false); // Disable loading state

      return;
    }
    if(!lastName){
      setlastNameError('Last Name is required');
      setLoading(false); // Disable loading state

      return;
    }

    try {
      const response = await fetch('http://localhost:3001/SignUp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, firstName,lastName }),
        credentials: 'include',
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toast.success('Thanks for registration but verify your email first', {
          autoClose: 1200,
        });
        window.location.href("/SignIn")
      }
      else if (response.status === 400) {
        // Email address is already in use, display the error message
        setError('Email address is already in use');
      } else {
        // Handle other response statuses or errors
        console.error('Registration failed');
      }
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false); // Disable loading state regardless of success/failure
    }
  };

  return (
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  autoComplete="given-name"
                  name="firstName"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={firstName}
                  onChange={(ev) => setFirstName(ev.target.value)}
                  autoFocus
                />
                {firstNameError && <div style={{ color: 'red' }}>{firstNameError}</div>}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  value={lastName}
                  onChange={(ev) => setlastName(ev.target.value)}
                  autoComplete="family-name"
                />
              {lastNameError && <div style={{ color: 'red' }}>{lastNameError}</div>}

              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={username}
                  onChange={(ev) => setUsername(ev.target.value)} 
                />
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {usernameError && <div style={{ color: 'red' }}>{usernameError}</div>}
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
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                />
                {passwordError && <div style={{ color: 'red' }}>{passwordError}</div>}
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
      {loading ? 'Signing Up...' : 'Sign Up'}
    </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="http://localhost:3000/SignIn" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
