// used in profile.jsx
import { db } from './firebase'; // Ensure the correct Firebase instance
import { collection, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export async function addDataToFireStore(data) {
    const auth = getAuth(); // Get the Firebase Auth instance
    const user = auth.currentUser; // Get the current logged-in user

    if (user) {
        try {
            // Set or update the document with the user's UID
            await setDoc(doc(db, "users", user.uid), {
                age: data.age,
                description: data.description,
                interests: data.interests,
            }, { merge: true }); // Use merge to update or set new data

            console.log("Document written for user ID: ", user.uid);
            return true; // Return true if successful
        } catch (error) {
            console.error("Error adding document: ", error);
            return false; // Return false if an error occurs
        }
    } else {
        console.error("No user logged in");
        return false; // Return false if no user is logged in
    }
}
