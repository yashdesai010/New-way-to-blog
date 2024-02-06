/* eslint-disable no-restricted-globals */
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState,useContext } from "react";
import { Navigate } from "react-router-dom";
import { Usercontext } from "./Usercontext";
import {toast } from 'react-toastify';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import 'react-toastify/dist/ReactToastify.css';

// Import useNavigate
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { setUserinfo } = useContext(Usercontext);
  const [showPassword, setShowPassword] = useState(false);
const[usernameerr,setusernameerror]=useState('');
const[passworderr,setpassworderror]=useState('');

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  

  const handleSubmit = async (ev) => {
    ev.preventDefault();
setusernameerror('');
setpassworderror('');
    if(!username){
      setusernameerror('Required')
      return
    }
    if(!password){
      setpassworderror('Required')
      return
    }

    try {
      const response = await fetch("http://localhost:3001/SignIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
  
      if (response.ok) {
        const userInfo = await response.json();
        if (userInfo.isVerified) {
          setUserinfo(userInfo);
          toast.success("LoggedIn", {
            autoClose: 1200,
          });
          setLoginSuccess(true);
        } else {
          toast.error("Email not verified. Please verify your email.", {
            autoClose: 1600,
          });
        }
      } else {
        toast.error("Something went wrong with password or email.", {
          autoClose: 1600,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.", {
        autoClose: 1600,
      });
    }
  };
  if (loginSuccess) {
    // Perform actions before returning
    
    // Now return the desired component or element
    return <Navigate to={"/"} />;
  }
  // history.pushState(null, null, location.href);
  //   window.onpopstate = function () {
  //       history.go(1);
  //   };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={username}
              onChange={(ev) => setusername(ev.target.value)}
            />
             {usernameerr && <div style={{ color: 'red' }}>{usernameerr}</div>}
       <TextField
      margin="normal"
      required
      fullWidth
      name="password"
      label="Password"
      type={showPassword ? 'text' : 'password'}
      id="password"
      autoComplete="current-password"
      value={password}
      onChange={(ev) => setpassword(ev.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleTogglePasswordVisibility}
              edge="end"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
     {passworderr && <div style={{ color: 'red' }}>{passworderr}</div>}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="http://localhost:3000/Forgotpass" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="http://localhost:3000/SignUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
