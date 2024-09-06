import React, {useState} from 'react';
import { useUserStore } from "../lib/userStore";
import "./profile.css"
import { serverTimestamp } from 'firebase/firestore';
import { addDataToFireStore } from "../lib/fireStoreUtil"; // Import the Firestore utility function

const Profile = () => {
    const { currentUser } = useUserStore();

const [description, setDescription] = useState(currentUser.description || '');
const handleChangeDescription = (e) => {
    setDescription(e.target.value)
}
const [interests, setInterests] = useState(currentUser.interests || '');
const handleChangeInterests = (e) => {
    setInterests(e.target.value)
}
const [age, setAge] = useState(currentUser.age || '');
const handleChangeAge = (e) => {
    setAge(e.target.value)
}
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
        <div className="profile-container">
            <h1>User Profile</h1>
            <div className="avatar">
                <img src={currentUser.avatar}></img>
            </div>
            {currentUser ? (
                <>
                <form onSubmit={handleSubmit}>
                <div class='details'>
                    <span>Username: </span>
                    <input  value={currentUser.username} disabled/>
                </div>
                <div class='details'>
                    <span>Email: </span>
                    <input  value={currentUser.email} disabled/>
                    {/* Add more user details as needed */}
                </div>
                <div class='details'>
                    <span>Interests: </span>
                    <input  value={interests} onChange={handleChangeInterests}/>
                    {/* Add more user details as needed */}
                </div>
                <div class='details'>
                    <span>Age: </span>
                    <input  type='number' value={age} onChange={handleChangeAge} />
                    {/* Add more user details as needed */}
                </div>
                <div class='details'>
                    <span>Description: </span>
                    <textarea  value={description} onChange={handleChangeDescription}></textarea>
                    {/* Add more user details as needed */}
                </div>
                <div className="details">
                    <button type='submit'>Save Changes</button>
                </div>
                </form>
                </>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default Profile;