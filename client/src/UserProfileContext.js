import React, { createContext, useState,useEffect } from 'react';

export const UserProfileContext = createContext(); // Create a new context object

export const UserProfileProvider = ({ children }) => {
  const [current, setUserName] = useState('');
  const [currentprofile, setCurrent] = useState({ name: '', imageUrl: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by making a request to a server route
    fetch('http://localhost:3001/api/check-auth', {
      method: 'GET',
      credentials: 'include', // Include cookies in the request
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Data from authentication check:', data); // Log the received data

        // Update the isLoggedIn state based on the response
        setIsLoggedIn(data.isAuthenticated);
        setIsLoggedIn(data.username)
      })
      
      .catch(error => {
        console.error('Error checking authentication status:', error);
      });
  }, []);


  return (
    <UserProfileContext.Provider value={{ current, setUserName, currentprofile, setCurrent,setIsLoggedIn,isLoggedIn }}>
      {children}
    </UserProfileContext.Provider>
  );
};
