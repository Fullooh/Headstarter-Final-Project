// userService.js

import { firestore } from './firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Function to handle swipe action
export const handleSwipe = async (userId, profileId, liked) => {
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    let isMatch = false;

    if (userDoc.exists()) {
        const userData = userDoc.data();

        // Initialize fields if they don't exist
        if (!userData.liked) await updateDoc(userRef, { liked: [] });
        if (!userData.disliked) await updateDoc(userRef, { disliked: [] });
        if (!userData.matches) await updateDoc(userRef, { matches: [] });

        if (liked) {
            await updateDoc(userRef, { liked: arrayUnion(profileId) });
        } else {
            await updateDoc(userRef, { disliked: arrayUnion(profileId) });
        }

        isMatch = await checkForMatch(userId, profileId, liked);
    } else {
        // Create user document if it doesn't exist
        await setDoc(userRef, {
            liked: liked ? [profileId] : [],
            disliked: liked ? [] : [profileId],
            matches: []
        });
    }

    return isMatch;
};

// Function to check if there's a match
const checkForMatch = async (userId, profileId, liked) => {
    if (!liked) return false;

    const profileRef = doc(firestore, 'users', profileId);
    const profileDoc = await getDoc(profileRef);

    if (profileDoc.exists()) {
        const profileData = profileDoc.data();

        if (Array.isArray(profileData.liked) && profileData.liked.includes(userId)) {
            // It's a match
            await updateDoc(profileRef, { matches: arrayUnion(userId) });
            await updateDoc(doc(firestore, 'users', userId), { matches: arrayUnion(profileId) });

            // Create a new chat document for the matched users
            const chatRef = collection(firestore, 'chats');
            await addDoc(chatRef, {
                allowedUsers: [userId, profileId],
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            console.log('You have a new match!');
            return true;
        }
    }
    return false;
};

// Function to fetch matched users with optional search query
export const fetchMatchedUsers = async (userId, searchQuery = "") => {
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
        const userData = userDoc.data();
        const matchedUserIds = userData.matches || [];

        const matchedUsers = await Promise.all(
            matchedUserIds.map(async (matchedUserId) => {
                const matchedUserRef = doc(firestore, 'users', matchedUserId);
                const matchedUserDoc = await getDoc(matchedUserRef);
                if (matchedUserDoc.exists()) {
                    return { id: matchedUserDoc.id, ...matchedUserDoc.data() };
                }
                return null;
            })
        );

        // Filter out any null values and apply search query on name
        return matchedUsers.filter(user => user !== null && user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return [];
};
