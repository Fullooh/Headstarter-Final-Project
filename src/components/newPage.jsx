import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, Card, CardMedia, CardActions, Container } from '@mui/material';

const NewPage = () => {
    const navigate = useNavigate();

    const handleHomeButtonClick = () => {
        navigate('/');
    };

    const handleProfileButtonClick = () => {
        navigate('/profile');
    };

    const handleLike = () => {
        console.log('Liked!');
        // Implement the like functionality here
    };

    const handleDislike = () => {
        console.log('Disliked!');
        // Implement the dislike functionality here
    };

    return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                SyncUp
            </Typography>

            {/* Centered block for Tinder clone */}
            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333', borderRadius: 2, p: 2, boxShadow: 3, mb: 4 }}>
                <CardMedia
                    component="img"
                    image="https://via.placeholder.com/450x270?text=User+Photo"
                    alt="User"
                    sx={{ width: '100%', borderRadius: 2, mb: 2 }}
                />
                <CardActions sx={{ justifyContent: 'space-between', width: '100%' }}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleLike}
                        fullWidth
                        sx={{ m: 1 }}
                    >
                        Like
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDislike}
                        fullWidth
                        sx={{ m: 1 }}
                    >
                        Dislike
                    </Button>
                </CardActions>
            </Card>

            {/* Buttons at the bottom of the screen */}
            <Box sx={{ position: 'fixed', bottom: 40, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleHomeButtonClick}
                >
                    Home
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleProfileButtonClick}
                >
                    Profile
                </Button>
            </Box>
        </Container>
    );
}

export default NewPage;
