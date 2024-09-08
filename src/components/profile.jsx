import React, { useState } from 'react';
import { useUserStore } from "../lib/userStore";
import { addDataToFireStore } from "../lib/fireStoreUtil"; 
import upload from "../lib/upload"; // Upload function to handle file uploads
import { setDoc, doc } from 'firebase/firestore'; // Ensure you're using these for Firestore
import { db } from '../lib/firebase'; // Assuming this is the Firestore instance

const Profile = () => {
    const { currentUser } = useUserStore();
    const [avatar, setAvatar] = useState({
        file: null,
        url: currentUser.avatar || "", // Preload current avatar if exists
    });
    const [description, setDescription] = useState(currentUser.description || '');
    const [interests, setInterests] = useState(currentUser.interests || '');
    const [age, setAge] = useState(currentUser.age || '');

    // Handle the avatar image selection and preview
    const handleAvatar = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]), // Show the preview image
            });
        }
    };

    // Handle form submission (including avatar upload)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Upload the new avatar image (if selected)
            let imgUrl = avatar.url;
            if (avatar.file) {
                imgUrl = await upload(avatar.file); // Upload the file and get the image URL
            }

            // Save the updated data (age, description, interests, avatar URL) to Firestore
            const userRef = doc(db, "users", currentUser.id); // Reference to the user's Firestore document
            await setDoc(userRef, {
                age, 
                description, 
                interests, 
                avatar: imgUrl // Save the new avatar URL or keep the old one if not updated
            }, { merge: true }); // Use { merge: true } to update only the provided fields

            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile: ", err);
            alert("Failed to update profile. Please try again.");
        }
    };

    return (
        <div className="profile-container">
            <h1>User Profile</h1>

            {currentUser ? (
                <>
                <form onSubmit={handleSubmit}>
                    <div className="avatar">
                        <img src={avatar.url} alt="User avatar" style={{ width: "150px", height: "150px", borderRadius: "50%" }} />
                        <input type="file" id="file" accept="image/*" onChange={handleAvatar} />
                        <p>Choose a new avatar</p>
                    </div>

                    <div className='details'>
                        <span>Username: </span>
                        <input value={currentUser.username} disabled />
                    </div>
                    <div className='details'>
                        <span>Email: </span>
                        <input value={currentUser.email} disabled />
                    </div>
                    <div className='details'>
                        <span>Interests: </span>
                        <input value={interests} onChange={(e) => setInterests(e.target.value)} />
                    </div>
                    <div className='details'>
                        <span>Age: </span>
                        <input type='number' value={age} onChange={(e) => setAge(e.target.value)} />
                    </div>
                    <div className='details'>
                        <span>Description: </span>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>

                    <div className="details">
                        <button type='submit'>Save Changes</button>
                    </div>
                </form>
                </>
            ) : (
                <p>Loading user data...</p>
            )}

            <div className="button-container">
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/NewPage')}>Profile</button>
            </div>

            <style jsx>{`
                .profile-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100vh;
                    padding: 20px;
                }

                .avatar {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .avatar img {
                    margin-bottom: 10px;
                }

                .button-container {
                    position: absolute;
                    bottom: 20px;
                    width: 100%;
                    display: flex;
                    justify-content: space-around;
                }

                button {
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default Profile;
