/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import CommentSection from './CommentSection';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import  Heart  from 'react-animated-heart';
import Fab from '@mui/material/Fab';
import FeedbackIcon from '@mui/icons-material/Feedback';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import io from 'socket.io-client';
import {Chip} from '@mui/material';
import { useDarkMode } from './DarkModeContext';
import { motion } from 'framer-motion';


const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [authorProfile, setAuthorProfile] = useState(null);
  const navigate = useNavigate();
  const [claps, setClaps] = useState(0);
  const [userData, setUserData] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpenone, setSnackbarOpenone] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize as not logged in
  const [allPosts, setAllPosts] = useState([]); // Store all posts
  const [selectedChip, setSelectedChip] = useState('All'); // Initialize with 'All' as default
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { toggleDarkMode } = useDarkMode();

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const searchBarStyle = {
    position: 'absolute',
    margin: '-5px',
    left: '10px',
    top: '52px',
    width: windowWidth > 768 ? '150px' : '100%', // Adjust width based on screen width
  };
  const chipStyle = {
    color: 'inherit',
    width: windowWidth > 768 ? 'auto' : '100%', // Adjust Chip width based on screen width
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/posts/all')
      .then((response) => response.json())
      .then((data) => {
        setAllPosts(data);
        setPosts(data); // Initially display all posts
      })
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);
  
  // Handle search on allPosts and update the posts state
  const handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    const filteredPosts = allPosts.filter((post) =>
      post.title.toLowerCase().includes(searchQuery)
    );
    setPosts(filteredPosts);
  };


  const handleAllChipClick = () => {
    setPosts(allPosts); // Show all posts
    setSelectedChip('All');

  };

  // Event handler for when "Technology" chip is clicked
  const handleTechnologyChipClick = () => {
    const technologyPosts = allPosts.filter(post => post.category === 'Technology');
    setPosts(technologyPosts); // Show posts with category "Technology"
    setSelectedChip('Technology');

  };

  const handleGeneralChipClick = () => {
    const generalpost = allPosts.filter(post => post.category === 'General');
    setPosts(generalpost); // Show posts with category "Technology"
    setSelectedChip('General');

  };

  const handleStockChipClick = () => {
    const stockpost = allPosts.filter(post => post.category === 'Stock');
    setPosts(stockpost); // Show posts with category "Technology"
    setSelectedChip('Stock');

  };

  const handleBuisnessChipClick = () => {
    const Businesspost = allPosts.filter(post => post.category === 'Business');
    setPosts(Businesspost); // Show posts with category "Technology"
    setSelectedChip('Business');

  };



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
        setUserData(data);
        setIsLoggedIn(data.isAuthenticated);
        setIsLoggedIn(data.username)
      })
      
      .catch(error => {
        console.error('Error checking authentication status:', error);
      });
  }, []);



  useEffect(() => {
    if(isLoggedIn){
    const newSocket = io('http://localhost:3001', { withCredentials: true });
    setSocket(newSocket);
  
    newSocket.on('post-liked', ({ postId, userId }) => {
      const likedPost = posts.find(post => post._id === postId);
      console.log("likedpost", likedPost);
      if (likedPost) {
        toast.info(`Post "${likedPost.title}" liked by user ${likedPost.firstName} ${likedPost.lastName}`);
      }
    });
    
  
    return () => newSocket.close();
 } }, [selectedPost, posts]);
  
  
  

  useEffect(() => {
    fetch('http://localhost:3001/api/posts/all')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  useEffect(() => {
    if (selectedPost) {
      fetch(`http://localhost:3001/userprofile?firstName=${selectedPost.firstName}`, {
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((profileData) => {
          setAuthorProfile(profileData);
        })
        .catch((error) => console.error('Error fetching author profile:', error));
    }
  }, [selectedPost]);


  const incrementClaps = async (postId) => {
    try {
      if (userData.id) {
        const response = await fetch('http://localhost:3001/like-post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId: postId,
            userId: userData.id,
          }),
          credentials: 'include',
        });
  
        if (response.ok) {
          setSnackbarOpenone(true);
          const updatedPosts = posts.map(post => {
            if (post._id === postId) {
              return { ...post, claps: post.claps + 1 };
            }
            return post;
          });
          setPosts(updatedPosts);
          setIsLiked(true);


//          if (socket) {
//   console.log('Emitted post-liked event:', { postId, userId: userData.id }); // Log just before emitting the event
//   socket.emit('post-liked', { postId, userId: userData.id });
// }

        } else {
          const errorData = await response.json();
          if (errorData.message === 'Post already liked by this user') {
            console.log('Post already liked by this user');
            setSnackbarOpen(true); // Open the Snackbar
            // Handle case where user has already liked the post
            // You can show a message or disable the like button
          } else {
            console.error('Failed to like the post');
          }
        }
      } else {
        console.error('User data not available');
      }
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false); // Close the Snackbar
    
  };
  const handleCloseSnackbarone=()=>{
    setSnackbarOpenone(false);
  }
  const handleFeedbackClick = () => {
    setFeedbackOpen(true);
  };

  
  const handleCloseFeedback = () => {
    setFeedbackOpen(false);
    // You can reset the feedback text if needed
    setFeedbackText('');
    setName('');

  };

  const handleSubmitFeedback = () => {
    setLoading(true); // Set loading state to true when submission starts

    fetch('http://localhost:3001/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, feedbackText }),
    })
      .then((response) => {
        setLoading(false); // Set loading state to false when response is received

        if (response.ok) {
          console.log('Feedback submitted successfully');
          handleCloseFeedback(); // Close the feedback form after successful submission
        } else {
          console.error('Failed to submit feedback');
          // Handle the case where the submission fails (e.g., display an error message)
        }
      })
      .catch((error) => {
        setLoading(false); // Set loading state to false on error

        console.error('Error submitting feedback:', error);
        // Handle the error scenario
      });
  };

  const handleImageClick = (event, post) => {
    event.preventDefault();
    setSelectedPost(post);
    setAuthorProfile(null);
    setClaps(post.claps);
    event.stopPropagation(); // Prevent the event from bubbling to the parent (post click event)
    const yOffset = 200; // Adjust this value according to your layout
    const element = document.querySelector('.img'); // Assuming this class encapsulates the image
    const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset;
  
    window.scrollTo({ top: y, behavior: 'smooth' }); // Smooth scroll to the image
  };

  const handleGoBack = () => {
    setSelectedPost(null);
    setAuthorProfile(null);
  };

  const handleAuthorClick = () => {
    if (authorProfile) {
      toggleDarkMode();
      navigate("/profileview", { state: { profileData: authorProfile } });
      console.log("Author Profile:", JSON.stringify(authorProfile));
      console.log("Navigating to /profileview...");
    }
  };
  

  
  return (
    <motion.div
      className="post-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
    <div className="post-page">
      {selectedPost ? (
         <motion.div
         className='img'
         initial={{ opacity: 0, y: -50 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -50 }}
         transition={{ duration: 0.5 }}
       >
        <div className="img">
          <div className='image'>
            {selectedPost.image && (
              <img src={selectedPost.image} alt="Post" />
            )}
          </div>
          <div className="texts">
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <div><Avatar src={authorProfile?.image}/></div>

            <h2>{selectedPost.title}</h2>
            <div>
            <Heart
                isClick={isLiked}
                onClick={() => incrementClaps(selectedPost._id)}
                style={{
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  marginLeft: '5px', // Adjust the spacing between title and heart icon
                
                  
                }}
              />
              </div>
              <h2 style={{marginTop:"-1px",marginLeft:"-3%"}}>{selectedPost.claps}</h2>

              </div>
                      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
      <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="info">
        Multiple likes not allowed
      </MuiAlert>
    </Snackbar>
    <Snackbar open={snackbarOpenone} autoHideDuration={3000} onClose={handleCloseSnackbarone}>
      <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbarone} severity="success">
        Thanks
      </MuiAlert>
    </Snackbar>
            <p className="summary">{selectedPost.summary}</p>

            {selectedPost.content && (
              <p className="summary" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            )}

            <a
              className='info'
              style={{ color: 'wheat', textDecoration: 'underline', cursor: 'pointer' }}
              onClick={handleAuthorClick}
            >
            Author:  {selectedPost.firstName} {selectedPost.lastName}
            </a>
            <p className='info'><b>Created Date: {new Date(selectedPost.createdDate).toLocaleString()}</b></p>

            <CommentSection postId={selectedPost._id} authorImage={authorProfile ? authorProfile.image : ''}/>
            <Button onClick={handleGoBack} className="back-button">
              Back to Posts
            </Button>
          </div>
        </div>
        </motion.div>

      ) : (
        <motion.div
          className='home'
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        <div className="home">
           <TextField
      id="search"
      label="Search"
      variant="outlined" // You can use 'outlined' or 'standard' as per your design
      onChange={handleSearch}
      style={searchBarStyle}

    />
   <div style={{ position: "absolute", display: "flex", flexDirection: "column", left: "10px" }}>
  <div style={{ marginBottom: "10px" }}>
  <Chip
      label="All"
      onClick={handleAllChipClick}
      color={selectedChip === 'All' ? 'primary' : 'default'}
      sx={chipStyle}    />
    <Chip
      label="Technology"
      onClick={handleTechnologyChipClick}
      color={selectedChip === 'Technology' ? 'primary' : 'default'}
      sx={chipStyle}    />
  </div>
  <div style={{ marginBottom: "10px" }}>
    <Chip label="General" onClick={handleGeneralChipClick}
    color={selectedChip === 'General' ? 'primary' : 'default'}
    sx={chipStyle}    />
    <Chip label="Stock" onClick={handleStockChipClick}
    color={selectedChip === 'Stock' ? 'primary' : 'default'}
    sx={chipStyle}    />
    <Chip label="Business" onClick={handleBuisnessChipClick}
    color={selectedChip === 'Business' ? 'primary' : 'default'}
    sx={chipStyle}    />
  </div>
</div>

          <div className="posts">
            
          {posts.map((post) => (
  <motion.div
    className="post"
    key={post._id}
    onClick={(event) => handleImageClick(event, post)}
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: -50, display: 'block' }}
    animate={{ opacity: 1, y: 0, display: 'block' }}
    transition={{ duration: 0.5 }}
    style={{ display: 'block' }} // Add this line to set display: block
  >
              <div className="post" key={post._id} onClick={(event) => handleImageClick(event, post)}>
                {post.image && (
                  <div className="img">
                    <img src={post.image} alt="Post Image" />
                  </div>
                )}

                <div className="content">
                  <h2>{post.title}</h2>
                  <b>Author: {post.firstName} {post.lastName}</b>
                  
                  <p className='info'><b>Created Date: {new Date(post.createdDate).toLocaleString()}</b></p>

                  <p>
                    {post.summary}
                    <button onClick={(event) => handleImageClick(event, post)}>Read More</button>
                  </p>
                </div>
              </div>
              </motion.div>

            ))}
          </div>
        </div>
        </motion.div>

      )}
       <Fab
        color="primary"
        aria-label="feedback"
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
        }}
        onClick={handleFeedbackClick}
      >
        <FeedbackIcon />
      </Fab>
      <Dialog open={feedbackOpen} onClose={handleCloseFeedback}>
        <DialogTitle>Give Feedback</DialogTitle>
        <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            label="Your Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Feedback"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedback} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitFeedback} color="primary" variant="contained">
          {loading ? 'Submitting...' : 'Submit'}
          </Button>

        
          
        </DialogActions>
      </Dialog>
     
    </div>
        </motion.div>

  );
};

export default PostList;
