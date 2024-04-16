import React, { useState } from 'react';

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = () => {
    if (messageText) {
      setMessages([...messages, { text: messageText, sender: 'me' }]);
      setMessageText('');
    }
  };

  const handleMessageInput = (event) => {
    setMessageText(event.target.value);
  };

  return (
    <div>
      <div className="chat-window">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender === 'me' ? 'sent' : 'received'}`}>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="type-bar">
        <input type="text" value={messageText} onChange={handleMessageInput} />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;