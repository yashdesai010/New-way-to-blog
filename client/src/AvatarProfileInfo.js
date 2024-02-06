import React, { useState, useEffect, useContext } from 'react';
import Avatar from "@mui/material/Avatar";
import { Link } from 'react-router-dom';
import { UserProfileContext } from './UserProfileContext';

export default function AvatarProfileInfo() {
  const { current, setUserName, currentprofile, setCurrent,isLoggedIn,setIsLoggedIn } = useContext(UserProfileContext);

  useEffect(() => {
    // Check if the user is logged in
    fetch('http://localhost:3001/api/check-auth', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setIsLoggedIn(data.isAuthenticated))
      .catch(error => console.error('Error checking authentication status:', error));
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetch("http://localhost:3001/api/current-user", {
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => setUserName(data.name))
        .catch(error => console.error('Error getting current user:', error));
    }
  }, [isLoggedIn, setUserName]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch("http://localhost:3001/allprofilesform", {
        credentials: 'include',
      })
        .then(response => response.json())
        .then(data => setCurrent({ image: data.image }))
        .catch(error => console.error('Error getting current user:', error));
    }
  }, [isLoggedIn, setCurrent]);

  return isLoggedIn ? (
    <header>
      <div className='username-container'>
        <div className='username'>
          <Avatar src={currentprofile.image || "https://mui.com/static/images/avatar/1.jpg"}></Avatar>
        </div>
        <Link to="/profile">
          <p>Welcome, {current}</p>
        </Link>
      </div>
    </header>
  ) : null;
  
  
    }
