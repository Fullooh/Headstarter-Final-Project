// services/conversationService.js
import { firestore } from './firebase';
import { doc, setDoc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';

// Function to create a new conversation between two users
export const createConversation = async (userId1, userId2) => {
  const conversationRef = doc(firestore, 'conversations', `${userId1}_${userId2}`);
  await setDoc(conversationRef, {
    users: [userId1, userId2],
    messages: []
  });
  return conversationRef.id;
};

// Function to send a message in a conversation
export const sendMessage = async (conversationId, senderId, message) => {
  const conversationRef = doc(firestore, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    messages: arrayUnion({
      senderId,
      message,
      timestamp: new Date().toISOString()
    })
  });
};

// Function to fetch messages in a conversation
export const fetchMessages = async (conversationId) => {
  const conversationRef = doc(firestore, 'conversations', conversationId);
  const conversationDoc = await getDoc(conversationRef);
  return conversationDoc.exists() ? conversationDoc.data().messages : [];
};
