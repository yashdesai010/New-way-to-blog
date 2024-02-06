import React, { useState } from 'react';
import Fab from '@mui/material/Fab';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

const Deleteaccount = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [deleteStatus, setDeleteStatus] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('http://localhost:3001/deleteAccount', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      setDeleteStatus(data.message);

      if (response.ok) {
        await fetch('http://localhost:3001/logout', {
          method: 'POST',
          credentials: 'include',
        });
         window.location.reload(); // Refresh the page
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteStatus('Failed to delete account');
    }
  };

  return (
    <div>
      <Fab
        color="secondary"
        aria-label="add"
        style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
        }}
        onClick={handleClickOpen}
      >
        <DeleteIcon />
      </Fab>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To confirm, please enter your username and password to delete your account.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="secondary">
            Delete Account
          </Button>
        </DialogActions>
        {deleteStatus && (
          <DialogContent>
            <DialogContentText>{deleteStatus}</DialogContentText>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Deleteaccount;
