import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin(username);
    navigate('/send-message');
  };

  return (
    <div className="container mt-4">
      <h1>Enter Your Name</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;