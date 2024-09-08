import React, { useState } from 'react';
import { useUserStore } from "../lib/userStore";
import { addDataToFireStore } from "../lib/fireStoreUtil";
import upload from "../lib/upload"; // Upload function to handle file uploads
import { setDoc, doc } from 'firebase/firestore'; // Ensure you're using these for Firestore
import { db } from '../lib/firebase'; // Assuming this is the Firestore instance
import { useNavigate } from "react-router-dom";
import { Button, Box, TextField, Typography, Container, Card, CardContent, CardMedia } from '@mui/material';

const Profile = () => {
    const { currentUser } = useUserStore();
    const [avatar, setAvatar] = useState({
        file: null,
        url: currentUser.avatar || "", // Preload current avatar if exists
    });
    const [description, setDescription] = useState(currentUser.description || '');
    const [interests, setInterests] = useState(currentUser.interests || '');
    const [age, setAge] = useState(currentUser.age || '');
    const navigate = useNavigate();

    const handleHomeButtonClick = () => {
        navigate('/');
    };

    const handleSyncUpButtonClick = () => {
        navigate('/NewPage');
    };

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
        <Container maxWidth="sm" sx={{ mt: 4, overflowY: "scroll", scrollbarWidth: "none" }}>
            {/* Buttons at the top of the screen */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button variant="contained" color="primary" onClick={handleHomeButtonClick}>
                    Home
                </Button>
                <Button variant="contained" color="secondary" onClick={handleSyncUpButtonClick}>
                    SyncUp
                </Button>
            </Box>

            <Typography variant="h4" component="h1" align="center" gutterBottom>
                User Profile
            </Typography>

            {currentUser ? (
                <Card sx={{ p: 3, mt: 2 }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <CardMedia
                                component="img"
                                image={avatar.url}
                                alt="User avatar"
                                sx={{ width: 150, height: 150, borderRadius: '50%', mb: 2 }}
                            />
                            <Button variant="outlined" component="label" sx={{ mb: 1 }}>
                                Choose a new avatar
                                <input type="file" accept="image/*" hidden onChange={handleAvatar} />
                            </Button>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Username"
                                value={currentUser.username}
                                fullWidth
                                disabled
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Email"
                                value={currentUser.email}
                                fullWidth
                                disabled
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Interests"
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Age"
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                            />
                        </Box>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Save Changes
                        </Button>
                    </form>
                </Card>
            ) : (
                <Typography align="center">Loading user data...</Typography>
            )}
        </Container>
    );
};

export default Profile;

