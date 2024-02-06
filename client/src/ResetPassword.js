import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setpassword] = useState('');
  const [message, setMessage] = useState('');
const{id,token}=useParams()
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a request to your server to initiate the password reset process
      const response = await fetch(`http://localhost:3001/resetpass/${id}/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setMessage('Password Changed');
      navigate("/SignIn");
      } else {
        setMessage('Try Again');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Reset:</label>
        <br></br>
        <TextField id="standard-basic" label="Standard" variant="standard" 
          type="password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default ResetPassword;
