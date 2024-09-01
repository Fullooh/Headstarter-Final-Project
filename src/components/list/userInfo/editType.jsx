import React, { useState } from "react";
import "./userInfo.css";
import { addDataToFireStore } from "../../../lib/fireStoreUtil"; // Import the Firestore utility function

const EditPopup = ({ onClose }) => {
    const [age, setAge] = useState("");                // State for age
    const [description, setDescription] = useState(""); // State for description
    const [interests, setInterests] = useState("");     // State for interests

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting data: ", { age, description, interests }); // Log data before submission
        const added = await addDataToFireStore({ age, description, interests });
        if (added) {
            setAge("");
            setDescription("");
            setInterests("");
            alert("Data added to Firestore DB!");
            onClose(); // Close the popup after successful submission
        } else {
            alert("Failed to save data. Please try again.");
        }
    };

    return (
        <div className="popup">
            <div className="popupContent">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Edit Profile</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="age">Age</label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter your age"
                    />
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe yourself"
                    />
                    <label htmlFor="interests">Interests</label>
                    <input
                        type="text"
                        id="interests"
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        placeholder="Your interests"
                    />
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default EditPopup;