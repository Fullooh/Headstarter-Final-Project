// profileService.js
import { firestore } from './firebase'; // Import the firestore instance
import { collection, getDocs } from 'firebase/firestore';

// Function to fetch all user profiles from the "profiles" collection
export const fetchUserProfiles = async () => {
  const querySnapshot = await getDocs(collection(firestore, 'profiles'));
  const profiles = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return profiles;
};
