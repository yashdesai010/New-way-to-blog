import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { FaMoon, FaSun } from "react-icons/fa"; // Import icons from React Icons
import { Link } from "react-router-dom";
import './checkbox.css';

const Darkmode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check the "darkMode" cookie when the component mounts
    const darkModeCookie = Cookies.get("darkMode");
    if (darkModeCookie === "true") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleDarkMode = (event) => {
    event.preventDefault(); // Prevent the default behavior of the link
  
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
  
    // Set or remove the "darkMode" cookie based on the user's preference
    if (newDarkMode) {
      Cookies.set("darkMode", "true", { expires: 365 }); // Expires in 365 days
      document.body.classList.add("dark-mode");
    } else {
      Cookies.remove("darkMode");
      document.body.classList.remove("dark-mode");
    }
  };

  return (
    
    <Link onClick={toggleDarkMode} style={{ display: "flex", alignItems: "center" }}>
      {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
      <span style={{ marginLeft: "8px" }}>
        {isDarkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
      </span>
    </Link> 
  );
};

export default Darkmode;
