import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'; // Import the icons
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CommentSection from "../CommentSection";
export default function PostPage() {
  const [postinfo, setpostinfo] = useState(null);
  const { id } = useParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // State for delete confirmation dialog

  useEffect(() => {
    fetch(`http://localhost:3001/api/posts/${id}`, {
      credentials: 'include',
    })
      .then((response) => {
        response.json().then((postinfo) => {
          setpostinfo(postinfo);
        });
      });
  }, []);

  const handleDelete = () => {
    // Show the delete confirmation dialog
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    // Send a DELETE request to delete the post
    fetch(`http://localhost:3001/api/posts/${postinfo._id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((response) => {
        if (response.status === 200) {
          // Post deleted successfully, you can redirect to the home page or perform any other action
          window.location.href = '/'; // Redirect to the home page
        } else {
          // Handle errors
          console.error('Error deleting post');
        }
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
      });
  };

  const handleCancelDelete = () => {
    // Close the delete confirmation dialog
    setShowDeleteDialog(false);
  };

  if (!postinfo) return '';

  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  return (
    <div className="post-page">
      <div className="image">
        <img src={postinfo.image} alt="" />
      </div>
      <h1>{postinfo.title}</h1>
  <p className="summary" dangerouslySetInnerHTML={renderHTML(postinfo.content)}></p>



      <Link to={`/edit/${postinfo._id}`}>
        <Button color="primary" variant="contained" startIcon={<EditIcon />}>
          Edit
        </Button>
      </Link>

      <Button onClick={handleDelete} color="secondary" variant="contained" startIcon={<DeleteIcon />}>
        Delete
      </Button>
      <div style={{ marginBottom: '20px' }} /> {/* Spacer with 20px margin bottom */}

      <CommentSection postId={postinfo._id}/>

      <Dialog
        open={showDeleteDialog}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
        
      </Dialog>

    </div>
  );
}
