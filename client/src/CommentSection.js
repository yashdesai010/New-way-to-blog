import React, { useState,useEffect} from 'react';
import Button from '@mui/material/Button'; // Import Button from Material-UI
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'; // Import Emoji Icon
import Picker from '@emoji-mart/react'

const CommentSection = ({postId}) => {
  const [text, setText] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize as not logged in
  const [comments, setComments] = useState([]);
  const [userData, setUserData] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
        setUserData(data)
      })
      
      .catch(error => {
        console.error('Error checking authentication status:', error);
      });
  }, []);

  useEffect(() => {
    // Fetch comments for the selected post
    fetch(`http://localhost:3001/api/comments/${postId}`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
        fetchCommentersImages(data); // Fetch commenters' images after fetching comments
      })
      .catch((error) => console.error('Error fetching comments:', error));
  }, [postId]);

  // Function to fetch commenters' images
  const fetchCommentersImages = (comments) => {
    comments.forEach((comment) => {
      fetch(`http://localhost:3001/userprofilecomment?username=${comment.name}`, {
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((profileData) => {
          comment.image = profileData.image;
          setComments([...comments]); // Update the state with modified comments
        })
        .catch((error) => console.error('Error fetching commenter profile:', error));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (isLoggedIn) {
        const response = await fetch('http://localhost:3001/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ postId, text }),
        });
  
        if (response.status === 201) {
          // Comment submitted successfully
          // Fetch comments again after a new comment is submitted
          const commentsResponse = await fetch(`http://localhost:3001/api/comments/${postId}`);
          const commentsData = await commentsResponse.json();
          
          // Fetch commenters' images for the updated comments
          fetchCommentersImages(commentsData);
  
          setComments(commentsData);
  
          console.log('Comment submitted successfully');
          setText('');
        } else {
          console.error('Error submitting comment');
        }
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/deletecomments/${postId}/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.status === 204) {
        const updatedComments = comments.filter((comment) => comment._id !== commentId);
        setComments(updatedComments);
      } else {
        console.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };   

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
 
  return (
    <form onSubmit={handleSubmit}>
      
      {isLoggedIn ? (
        <div className='comment-box'>

              <TextField
            id="text"
            label="Comment"
            variant="outlined"
            multiline
            rows={2}
            fullWidth
            value={text}
            onChange={(e) => setText(e.target.value)}
            InputProps={{
              endAdornment: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={toggleEmojiPicker}>
                    <EmojiEmotionsIcon />
                  </IconButton>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ marginLeft: '-92px', width: '10%' }}
                  >
                    Send
                  </Button>
                </div>
              ),
            }}
            required
          />
           {showEmojiPicker && (
            <Picker
            onEmojiSelect={(emoji) => setText(prevText => prevText + emoji.native)}
            style={{ position: 'absolute', bottom: '50px', right: '20px' }}
          />
          
          )}
          <List>
            
            {Array.isArray(comments) && comments.length > 0 ? (
              comments.map((comment, index) => (
                
                <ListItem key={index}>
                  
                  
                  <ListItemText primary={comment.name} secondary={comment.text} />
                  {console.log('userData.id:', userData.id)}
{console.log('comment.userid:', comment.userid)}
{isLoggedIn && userData.id === comment.userid && (
  <IconButton
    color="error"
    aria-label="delete comment"
    style={{ display: 'contents' }}
    onClick={() => handleDeleteComment(comment._id)}
  >
    <DeleteIcon />
  </IconButton>
)}
                  {comment.image ? (
                    <Avatar src={comment.image}></Avatar>
                    
                  ) : (
                    <Avatar>U</Avatar>
                  )}
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No comments available" />
              </ListItem>
            )}
          </List>
        </div>
        
      ) : null}
    </form>
  );
};

export default CommentSection;
