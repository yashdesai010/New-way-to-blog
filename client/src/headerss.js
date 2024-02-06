/* eslint-disable jsx-a11y/anchor-is-valid */
import { Link, useLocation } from "react-router-dom";
import "./App.css";
import { useContext, useEffect } from "react";
import { Usercontext } from "./Usercontext";
import { Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const { userInfo, setUserinfo } = useContext(Usercontext);
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:3001/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserinfo(userInfo);
      });
    });
  }, [setUserinfo]);

  function logout() {
    fetch("http://localhost:3001/logout", {
      credentials: "include",
      method: 'POST',
    });

    setUserinfo(null);
    window.location.reload();
    window.location.href = '/';
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        New Way To Blog
      </Link>

      <AnimatePresence exitBeforeEnter={false} mode="wait">
        <motion.nav
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {username ? (
            <>
              <Link to="/Postlist">See all post</Link>
              <Link to="/create">Write</Link>
              <a onClick={logout}>Logout</a>
            </>
          ) : (
            <>
              <Button component={Link} to="/AlphaVantageData" color="primary">Short Stories</Button>
              <Button component={Link} to="/SignIn" color="primary">Sign In</Button>
              <Button component={Link} to="/SignUp" color="primary">Sign Up</Button>
            </>
          )}
        </motion.nav>
      </AnimatePresence>
    </header>
  );
}

export default Header;
