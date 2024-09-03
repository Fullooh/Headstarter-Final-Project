// app/chat/MessageSection.js
import React, { useState, useEffect } from 'react';
import { fetchMessages, sendMessage } from '../services/messageService'; // Update with your service paths

function MessageSection({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const fetchedMessages = await fetchMessages(conversationId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await sendMessage(conversationId, newMessage);
        setNewMessage('');
        const updatedMessages = await fetchMessages(conversationId);
        setMessages(updatedMessages);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="message-section">
      <div className="message-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.isUser ? 'user' : 'other'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default MessageSection;
