import React, { useState } from 'react';
import { useUserStore } from "../lib/userStore";
import { addDataToFireStore } from "../lib/fireStoreUtil"; 
import upload from "../lib/upload"; // Upload function to handle file uploads
import { setDoc, doc } from 'firebase/firestore'; // Ensure you're using these for Firestore

const Profile = () => {
    const { currentUser } = useUserStore();
    const [avatar, setAvatar] = useState({
        file: null,
        url: currentUser.avatar || "",
    });
    const [description, setDescription] = useState(currentUser.description || '');
    const [interests, setInterests] = useState(currentUser.interests || '');
    const [age, setAge] = useState(currentUser.age || '');

    const handleAvatar = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]), // Show the preview image
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Upload the new avatar image (if selected)
        let imgUrl = avatar.url;
        if (avatar.file) {
            imgUrl = await upload(avatar.file); // Upload the file and get the image URL
        }

        // Save the updated data (age, description, interests, avatar URL) to Firestore
        const added = await addDataToFireStore({ 
            age, 
            description, 
            interests, 
            avatar: imgUrl // Save the new avatar URL
        });

        if (added) {
            alert("Profile updated successfully!");
        } else {
            alert("Failed to update profile. Please try again.");
        }

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
      
            const imgUrl = await upload(avatar.file);
      
            await setDoc(doc(db, "users", res.user.uid), {
              username,
              email,
              avatar: imgUrl,
              id: res.user.uid,
              blocked: [],
            });
      
            await setDoc(doc(db, "userchats", res.user.uid), {
              chats: [],
            });
      
            toast.success("Account created! You can login now!");
          } catch (err) {
            console.log(err);
            toast.error(err.message);
          } finally {
            setLoading(false);
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
                        <input type="file" accept="image/*" onChange={handleAvatar} />
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
