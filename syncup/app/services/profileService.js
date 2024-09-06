// profileService.js
import { db } from './firebase'; // Import the initialized Firestore instance
import { collection, getDocs } from 'firebase/firestore';

// Function to fetch all user profiles from the "users" collection
export const fetchUserProfiles = async () => {
  const querySnapshot = await getDocs(collection(db, 'users')); // Use 'db' instead of 'firestore'
  const profiles = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return profiles;
};
