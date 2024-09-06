import React, { useState, useEffect } from "react";
import "./userInfo.css"; // Make sure this path is correct
import { db } from "../../../lib/firebase"; // Correct import of Firestore instance
import { collection, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const VideoPopup = ({ onClose }) => {
    const [userData, setUserData] = useState(null); // State to store the fetched user data

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const user = auth.currentUser; // Get the current logged-in user

            if (user) {
                try {
                    const userDoc = doc(db, "users", user.uid); // Ensure the collection name is correct
                    const docSnapshot = await getDoc(userDoc);

                    if (docSnapshot.exists()) {
                        setUserData(docSnapshot.data()); // Set the user data if the document exists
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching user data: ", error);
                }
            } else {
                console.log("No user logged in");
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="popup">
            <div className="popupContent">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Video Call</h3>
                {userData ? (
                    <div>
                        <p>Age: {userData.age}</p>
                        <p>Description: {userData.description}</p>
                        <p>Interests: {userData.interests}</p>
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>
        </div>
    );
}

export default VideoPopup;