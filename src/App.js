import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
          element={<SendMessagePage username={username} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
