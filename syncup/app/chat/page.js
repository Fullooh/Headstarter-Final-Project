// app/chat/page.js
import React from 'react';
import MessageSection from './messageSection';

export default function ChatPage() {
  const conversationId = 'example-conversation-id'; // Replace with actual logic to get conversation ID

  return (
    <div className="chat-page">
      <h1>Chat</h1>
      <MessageSection conversationId={conversationId} />
    </div>
  );
}
