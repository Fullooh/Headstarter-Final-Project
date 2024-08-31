import { db } from './firebase'; // Ensure you are importing the correct Firebase Firestore instance
import { collection, addDoc } from "firebase/firestore";

export async function addDataToFireStore(data) {
    try {
        // Add the data to the 'Messages' collection in Firestore
        const docRef = await addDoc(collection(db, "UserInfo"), {
            age: data.age,
            description: data.description,
            interests: data.interests,
        });
        console.log("Document written with ID: ", docRef.id);
        return true; // Return true if the document is added successfully
    } catch (error) {
        console.error("Error adding document: ", error);
        return false; // Return false if an error occurs
    }
}
