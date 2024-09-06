'use client'
import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, IconButton, Avatar, Typography, Badge, TextField } from '@mui/material';
import { Send } from '@mui/icons-material';
import { getUsers, getOrCreateConversation, listenToMessages, sendMessage } from './conversationService'; // Adjust path if necessary

function Page({ userId }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const usersList = await getUsers();
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const startConversation = async (user) => {
    if (!userId || !user.id) {
      console.error("User ID or Selected User ID is undefined:", { userId, user });
      return;
    }

    setSelectedUser(user);

    // Create or fetch an existing conversation between the users
    const convoId = await getOrCreateConversation(userId, user.id);
    
    if (!convoId) {
      console.error("Failed to get or create a conversation");
      return;
    }

    setSelectedConversation(convoId);

    const unsubscribe = listenToMessages(convoId, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '' && selectedConversation) {
      if (!userId) {
        console.error("Cannot send message because userId is undefined.");
        return;
      }

      const message = {
        text: newMessage,
        senderId: userId,
        timestamp: new Date(),
      };
      try {
        await sendMessage(selectedConversation, message);
        setNewMessage(''); // Clear the input field after sending the message
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    } else {
      console.error("Cannot send message: either the message is empty or the conversation is not selected.");
    }
  };

  return (
    <Box display="flex" height="100vh" bgcolor="#F5F5F5" padding="5%">
      {/* User List */}
      <Box width="35%" bgcolor="#87a3ec" boxShadow={2} overflow="hidden">
        <List>
          {users.map((user) => (
            <ListItem
              key={user.id}
              display="flex"
              alignItems="center"
              padding={2}
              bgcolor={selectedUser?.id === user.id ? "#FFF" : "#FAFAFA"}
              borderBottom={1}
              borderColor="#E0E0E0"
              sx={{ cursor: 'pointer' }}
              onClick={() => startConversation(user)}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={<Box width={13} height={13} bgcolor="#8BC34A" borderRadius="50%" border={1} borderColor="#FAFAFA" />}
              >
                <Avatar src={user.avatarUrl || `https://source.unsplash.com/random?sig=${user.id}`} sx={{ width: 45, height: 45 }} />
              </Badge>
              <Box ml={2} flexGrow={1}>
                <Typography variant="body1" noWrap>{user.name}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Chat Section */}
      <Box width="calc(65% - 85px)" display="flex" flexDirection="column">
        {/* Header */}
        <Box display="flex" alignItems="center" padding={2} bgcolor="#FFF" boxShadow={1}>
          {selectedUser && (
            <>
              <Avatar src={selectedUser.avatarUrl || `https://source.unsplash.com/random?sig=${selectedUser.id}`} sx={{ width: 45, height: 45 }} />
              <Typography variant="h6" sx={{ marginLeft: 2 }}>{selectedUser.name}</Typography>
            </>
          )}
        </Box>

        {/* Messages */}
        <Box flexGrow={1} padding={2} bgcolor="#FFF" overflow="auto">
          {messages.map((msg, index) => (
            <Box key={index} display="flex" alignItems="center" marginBottom={2} justifyContent={msg.senderId === userId ? 'flex-end' : 'flex-start'}>
              {msg.senderId !== userId && <Avatar src={selectedUser.avatarUrl || "https://source.unsplash.com/random?sig=1"} sx={{ width: 45, height: 45 }} />}
              <Box ml={2}>
                <Typography variant="body1" sx={{ bgcolor: msg.senderId === userId ? '#e3effd' : '#f6f6f6', padding: 2, borderRadius: 2 }}>
                  {msg.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        {selectedConversation && (
          <Box display="flex" alignItems="center" padding={2} bgcolor="#FFF" borderTop={1} borderColor="#EEE">
            <TextField
              variant="standard"
              placeholder="Type your message here"
              fullWidth
              sx={{ marginX: 2 }}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <IconButton color="primary" onClick={handleSendMessage}>
              <Send />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Page;
