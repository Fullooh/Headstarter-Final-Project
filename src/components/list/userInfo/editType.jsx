import React, { useState, useEffect } from "react";
import "./userInfo.css";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { addDataToFireStore } from "../../../lib/fireStoreUtil";

const UserProfilePopup = ({ onClose }) => {
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [age, setAge] = useState("");
    const [description, setDescription] = useState("");
    const [interests, setInterests] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                try {
                    const userDoc = doc(db, "User", user.uid);
                    const docSnapshot = await getDoc(userDoc);

                    if (docSnapshot.exists()) {
                        const data = docSnapshot.data();
                        setUserData(data);
                        setAge(data.age);
                        setDescription(data.description);
                        setInterests(data.interests);
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

        if (!userData) {
            fetchUserData();
        }
    }, [userData]);

    const handleEdit = async (e) => {
        e.preventDefault();
        const added = await addDataToFireStore({ age, description, interests });
        if (added) {
            setUserData({ age, description, interests });
            alert("Data updated in Firestore DB!");
            setEditMode(false); // Turn off edit mode after successful update
        } else {
            alert("Failed to save data. Please try again.");
        }
    };

    return (
        <div className="popup">
            <div className="popupContent">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>{editMode ? "Edit Profile" : "User Profile"}</h3>
                {editMode ? (
                    <form onSubmit={handleEdit}>
                        <label htmlFor="age">Age</label>
                        <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter your age"/>
                        <label htmlFor="description">Description</label>
                        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe yourself"/>
                        <label htmlFor="interests">Interests</label>
                        <input type="text" id="interests" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="Your interests"/>
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                    </form>
                ) : (
                    <>
                        {userData ? (
                            <div>
                                <p>Age: {userData.age}</p>
                                <p>Description: {userData.description}</p>
                                <p>Interests: {userData.interests}</p>
                                <button onClick={() => setEditMode(true)}>Edit Profile</button>
                            </div>
                        ) : (
                            <p>Loading user data...</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfilePopup;


