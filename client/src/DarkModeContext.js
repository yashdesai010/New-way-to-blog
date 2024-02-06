import { createContext, useContext, useState } from 'react';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState(null);

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode);
    console.log("Dark mode toggled:", !darkMode);
  };
  
  const updateUserData = (newUserData) => {
    setUserData(newUserData);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, userData, updateUserData }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  return useContext(DarkModeContext);
};
