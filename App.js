import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const socket = new WebSocket('ws://localhost:8080');

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
   socket.onmessage = async (event) => {
  try {
    const text = await event.data.text(); // 👈 convert Blob to string
    const newMessage = JSON.parse(text);  // 👈 then parse JSON
    setMessages((prev) => [...prev, newMessage]);
  } catch (err) {
    console.error("Failed to parse message:", err);
  }
};

  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() !== '') {
      const message = { text: input };
      socket.send(JSON.stringify(message));
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <h2>Real-Time Chat</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div className="message" key={index}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
