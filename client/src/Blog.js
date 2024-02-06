import React from 'react';
import { Link } from 'react-router-dom';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useEffect,useState } from 'react';
function Blog({ summary, title, image,firstName,_id,lastName}) {
  const blogStyle = {
    fontFamily: 'Sometype Mono, monospace'  };
 
    const [comments, setComments] = useState([]);
    const [newComments, setNewComments] = useState(false);
    const [seenComments, setSeenComments] = useState(false); // New state to track seen comments

    // Fetch comments for the specific post
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/comments/${_id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    useEffect(() => {
      fetchComments();
    }, [_id]);
  
    useEffect(() => {
      // Logic to check for new comments
      // For example, compare the lengths of existing and fetched comments
      if (comments.length > 0) {
        setNewComments(true);
      }
    }, [comments]);

    const handleNotificationClick = () => {
      setSeenComments(true);
      localStorage.setItem(`seenComments_${_id}`, 'true'); // Store in local storage
    };
  
    useEffect(() => {
      // Check if user has seen comments in local storage
      const hasSeen = localStorage.getItem(`seenComments_${_id}`);
      if (hasSeen === 'true') {
        setSeenComments(true);
      }
    }, [_id]);



  return (
    <div className="post" style={blogStyle}>
      <div className="image">
        <Link to={`/post/${_id}`}>
        <div>
          <img src={image} alt="" />
        </div>
        </Link>
      </div>
      <div className="texts">
      <Link to={`/post/${_id}`}>
        <h2>{title}</h2>
        </Link>
        <p className="info">
          
          <a className="author">{firstName}{lastName}</a>
          {newComments && !seenComments && (
              <NotificationsActiveIcon
                style={{ color: 'red', marginLeft: '4px', cursor: 'pointer' }}
                onClick={handleNotificationClick}
              />
            )}
          
        </p>
<p className='summary'>{summary}</p>  
<Link to={`/post/${_id}`} style={{ color: 'blue', textDecoration: 'underline' }}>Read More</Link>
</div>
    </div>
  );
}

export default Blog;
