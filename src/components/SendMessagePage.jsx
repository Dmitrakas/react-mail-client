import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import { Navigate } from 'react-router-dom';
import '../styles/autosuggest.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function SendMessagePage({ username }) {
  const [recipientName, setRecipientName] = useState('');
  const [title, setTitle] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const fetchMessages = () => {
      axios
        .get(`https://dmitrakas-message-server.onrender.com/api/messages/${username}`)
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.error('Error retrieving messages:', error);
        });
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [username]);

  const fetchSuggestions = async (value) => {
    try {
      const response = await axios
        .get(`https://dmitrakas-message-server.onrender.com/api/recipient-names?query=${value}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  const handleRecipientChange = (event, { newValue }) => {
    setRecipientName(newValue);
  };

  const handleSuggestionsFetchRequested = ({ value }) => {
    if (value && value.trim()) {
      const trimmedValue = value.trim();
      fetchSuggestions(trimmedValue)
        .then((suggestions) => {
          setSuggestions(suggestions)
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion) => suggestion;

  const renderSuggestion = (suggestion) => <div>{suggestion}</div>;

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = {
      senderName: username,
      recipientName,
      title,
      messageBody,
    };

    axios
      .post('https://dmitrakas-message-server.onrender.com/api/messages', message)
      .then(() => {
        setRecipientName('');
        setTitle('');
        setMessageBody('');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  const handleToggleMessageBody = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        if (message._id === messageId) {
          return {
            ...message,
            expanded: !message.expanded,
          };
        }
        return message;
      })
    );
  };
  
  const handleLogout = () => {
    setShouldRedirect(true);
  };

  if (!username || shouldRedirect) {
    return <Navigate to="/" />;
  }

  const inputProps = {
    placeholder: 'Enter recipient name',
    value: recipientName,
    onChange: handleRecipientChange,
  };

  return (
    <div className="container mt-4">
      <h1>Message Form:</h1>
      <button className="btn btn-warning mb-3" onClick={handleLogout}>
        Change User
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="recipientName">Recipient Name:</label>
          <div>
            <Autosuggest
              className="react-autosuggest__container"
              suggestions={suggestions}
              onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
              onSuggestionsClearRequested={handleSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
            />
          </div>
        </div>
        <div className="form-group mt-2">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label htmlFor="messageBody">Message Body:</label>
          <textarea
            className="form-control"
            id="messageBody"
            rows="4"
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary  mt-2">
          Send Message
        </button>
      </form>
      <h2 className="mt-4">Your Messages:</h2>
      {messages.length === 0 ? (
        <p>No messages.</p>
      ) : (
        <ul className="list-group">
          {messages.map((message) => (
            <li
              className="list-group-item  mt-4 border border-dark rounded"
              key={message._id}
              onClick={() => handleToggleMessageBody(message._id)}
            >
              <strong>Sender:</strong> {message.senderName}<br />
              <strong>Title:</strong> {message.title}
              {message.expanded && (
                <div>
                  <strong>Message:</strong> {message.messageBody}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SendMessagePage;
