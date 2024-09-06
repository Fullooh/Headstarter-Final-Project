// conversationService.js
import { db } from '../services/firebase';
import { collection, addDoc, query, where, getDocs, onSnapshot, setDoc, doc } from 'firebase/firestore';

// Get users for the conversation list
export const getUsers = async () => {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return usersList;
};

// Get or create a conversation between two users
export const getOrCreateConversation = async (userId1, userId2) => {
  const participants = [userId1, userId2].sort(); // Sort IDs to ensure uniqueness
  const convoId = participants.join('_');

  // Check if the conversation already exists
  const q = query(collection(db, 'conversations'), where('participants', '==', participants));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    // If the conversation does not exist, create a new one
    await setDoc(doc(db, 'conversations', convoId), {
      participants,
      createdAt: new Date(),
    });
  }

  return convoId; // Return the conversation ID
};

// Send a message
export const sendMessage = async (conversationId, message) => {
  const docRef = await addDoc(collection(db, `conversations/${conversationId}/messages`), message);
  return docRef.id;
};

// Listen to messages in real-time
export const listenToMessages = (conversationId, callback) => {
  const q = query(collection(db, `conversations/${conversationId}/messages`));
  return onSnapshot(q, (querySnapshot) => {
    let messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
  });
};
