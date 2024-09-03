// services/conversationService.js
import { firestore } from './firebase';
import { doc, setDoc, updateDoc, getDoc, arrayUnion, collection, getDocs } from 'firebase/firestore';

// Function to create a new conversation between two users
export const createConversation = async (userId1, userId2) => {
  const conversationId = [userId1, userId2].sort().join('_'); // Ensure consistent conversation ID
  const conversationRef = doc(firestore, 'conversations', conversationId);
  await setDoc(conversationRef, {
    users: [userId1, userId2],
    messages: []
  });
  return conversationRef.id;
};

// Function to send a message in a conversation
export const sendMessage = async (conversationId, senderId, message) => {
  const conversationRef = doc(firestore, 'conversations', conversationId);
  const conversationDoc = await getDoc(conversationRef);

  if (conversationDoc.exists()) {
    // If the document exists, update it with the new message
    await updateDoc(conversationRef, {
      messages: arrayUnion({
        senderId,
        message,
        timestamp: new Date().toISOString(),
      }),
    });
  } else {
    // If the document doesn't exist, create it with the initial message
    await setDoc(conversationRef, {
      users: [senderId], // Adjust this based on your logic
      messages: [
        {
          senderId,
          message,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }
};

// Function to fetch messages in a conversation
export const fetchMessages = async (conversationId) => {
  const conversationRef = doc(firestore, 'conversations', conversationId);
  const conversationDoc = await getDoc(conversationRef);
  return conversationDoc.exists() ? conversationDoc.data().messages : [];
};

// New Function: Fetch conversations involving a specific user
export const fetchUserConversations = async (userId) => {
  const conversationsQuerySnapshot = await getDocs(collection(firestore, 'conversations'));
  const userConversations = [];

  conversationsQuerySnapshot.forEach((doc) => {
    const conversation = doc.data();
    if (conversation.users.includes(userId)) {
      userConversations.push({ id: doc.id, ...conversation });
    }
  });

  return userConversations;
};
