import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { fetchMatchedUsers, handleSwipe } from '../lib/userService';
import { fetchUserProfiles } from '../lib/profileService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import { Button, Box, Typography, Card, CardMedia, CardActions, Container } from '@mui/material';
import { db } from "../lib/firebase";
import { doc, updateDoc, arrayUnion, serverTimestamp, setDoc, collection } from "firebase/firestore";
import { useUserStore } from "../lib/userStore";
import 'swiper/css';
import 'swiper/css/effect-coverflow';

const NewPage = () => {
    const [user, setUser] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const [matchedUser, setMatchedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [dislikeLoading, setDislikeLoading] = useState(false);
    const { currentUser } = useUserStore();
    const navigate = useNavigate();
    const auth = getAuth();
    const phrases = ["Team Up", "Code Together", "Conquer the Future"];

    const swiperRef = useRef(null); // Swiper reference

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                loadProfiles(user.uid);
            } else {
                navigate('/register');
            }
        });
        return () => unsubscribe();
    }, [auth, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const loadProfiles = async (currentUserId) => {
        try {
            const fetchedProfiles = await fetchUserProfiles();
            const filteredProfiles = fetchedProfiles.filter(profile => profile.id !== currentUserId);
            setProfiles(filteredProfiles);
        } catch (error) {
            console.error("Error fetching profiles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserSwipe = async (profileId, liked) => {
        if (liked) {
            setLikeLoading(true);
        } else {
            setDislikeLoading(true);
        }

        try {
            const isMatch = await handleSwipe(user.uid, profileId, liked);
            if (isMatch) {
                setMatchedUser(profileId);
                setShowMatchModal(true);  // Show the match modal if there's a match
            } else {
                // Swipe to the next profile only if there is no match
                if (swiperRef.current) {
                    swiperRef.current.swiper.slideNext();
                }
            }
        } catch (error) {
            console.error("Error processing swipe:", error);
        } finally {
            setLikeLoading(false);
            setDislikeLoading(false);
        }
    };

    const handleAddUser = async () => {
        if (!matchedUser) return;

        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");

        try {
            const newChatRef = doc(chatRef);

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });

            await updateDoc(doc(userChatsRef, matchedUser), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now(),
                }),
            });

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: "",
                    receiverId: matchedUser,
                    updatedAt: Date.now(),
                }),
            });
            console.log("Working");
        } catch (err) {
            console.log("Error adding user:", err);
        }
    };

    const closeModal = () => {
        setShowMatchModal(false);

        // Only swipe to the next profile if there was a match
        if (matchedUser && swiperRef.current) {
            swiperRef.current.swiper.slideNext();
        }
    };

    const handleHomeButtonClick = () => {
        navigate('/');
    };

    const handleSyncUpButtonClick = () => {
        navigate('/Profile');
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                SyncUp
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Button variant="contained" color="primary" onClick={handleHomeButtonClick}>
                    Home
                </Button>
                <Button variant="contained" color="secondary" onClick={handleSyncUpButtonClick}>
                    Profile
                </Button>
            </Box>

            {loading ? (
                <Typography variant="h5">Loading...</Typography>
            ) : (
                <Swiper
                    ref={swiperRef} // Attach ref to Swiper
                    modules={[EffectCoverflow]} // Removed Navigation module
                    effect="coverflow"
                    grabCursor
                    centeredSlides
                    slidesPerView={1}
                    loop
                    coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                    }}
                    spaceBetween={50}
                >
                    {profiles.map((profile, index) => (
                        <SwiperSlide key={profile.id || index}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333', borderRadius: 2, p: 2, boxShadow: 3, mb: 4 }}>
                                <CardMedia
                                    component="img"
                                    image={profile.avatar || "https://via.placeholder.com/450x270?text=User+Photo"}
                                    alt="User"
                                    sx={{ width: '100%', borderRadius: 2, mb: 2 }}
                                />
                                <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                                    Name: {profile.username || "N/A"}
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                                    Age: {profile.age || "N/A"}
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                                    Interests: {Array.isArray(profile.interests) ? profile.interests.join(', ') : 'No interests'}
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                                    Description: {profile.description || 'No description provided'}
                                </Typography>

                                <CardActions sx={{ justifyContent: 'space-between', width: '100%' }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleUserSwipe(profile.id, true)}
                                        fullWidth
                                        sx={{ m: 1 }}
                                        disabled={likeLoading || dislikeLoading}
                                    >
                                        {likeLoading ? "Processing..." : "Yay"}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleUserSwipe(profile.id, false)}
                                        fullWidth
                                        sx={{ m: 1 }}
                                        disabled={likeLoading || dislikeLoading}
                                    >
                                        {dislikeLoading ? "Processing..." : "Nay"}
                                    </Button>
                                </CardActions>
                            </Card>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {showMatchModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <h2 className="text-4xl font-bold mb-4">It's a Match!</h2>
                        <p className="text-lg mb-4">You and another user have liked each other!</p>
                        <Button
                            onClick={handleAddUser}
                            className="bg-green-500 text-white px-4 py-2 rounded mb-2"
                        >
                            Add User
                        </Button>
                        <Button
                            onClick={closeModal}
                            className="bg-violet-500 text-white px-4 py-2 rounded"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </Container>
    );
}

export default NewPage;
