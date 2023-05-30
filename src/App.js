import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SendMessagePage from './components/SendMessagePage';

function App() {
  const [username, setUsername] = useState('');

  const handleLogin = (username) => {
    setUsername(username);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/send-message"
          element={username ? <SendMessagePage username={username} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
