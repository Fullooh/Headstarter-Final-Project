import React, { useState, useEffect } from "react";
import "./userInfo.css"; // Assuming you create a separate CSS file for this component
import { db } from "../../../lib/firebase"; // Ensure you import your Firestore instance correctly
import { collection, getDocs } from "firebase/firestore";

const VideoPopup = ({ onClose }) => {
    const [userData, setUserData] = useState([]); // State to store fetched user data

    useEffect(() => {
        // Fetch data from Firestore when the component mounts
        const fetchUserData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "UserInfo")); // Replace 'Messages' with your actual collection name
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUserData(data); // Store fetched data in state
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchUserData(); // Call the fetch function
    }, []);

    return (
        <div className="popup">
            <div className="popupContent">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Video Call</h3>
                {userData.length > 0 ? (
                    userData.map(user => (
                        <div key={user.id}>
                            <p>Age: {user.age}</p>
                            <p>Description: {user.description}</p>
                            <p>Interests: {user.interests}</p>
                        </div>
                    ))
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>
        </div>
    );
}

export default VideoPopup;