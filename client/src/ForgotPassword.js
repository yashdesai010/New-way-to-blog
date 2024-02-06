import React, { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Initialize loading state as false

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on form submission

    try {
      // Send a request to your server to initiate the password reset process
      const response = await fetch('http://localhost:3001/forgotpass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      if (response.ok) {
        setMessage('Password reset email sent. Only registered user can get mail');
      } else {
        setMessage('Failed to send the reset email. Please check your email address.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading back to false regardless of the response
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default ForgotPassword;
