import React from 'react';
import { useUserStore } from "../lib/userStore";
import { useNavigate } from "react-router-dom";

const NewPage = () => {
    const { currentUser } = useUserStore();
    const navigate = useNavigate();

    const handleHomeButtonClick = () => {
        navigate('/');
    };

    const handleProfileButtonClick = () => {
        navigate('/profile');
    };

    return (
        <div className="profile-container">
            <h1>SyncUp</h1>
            {currentUser ? (
                <div>
                    <p>Email: {currentUser.email}</p>
                    {/* Add more user details as needed */}
                </div>
            ) : (
                <p>Loading user data...</p>
            )}

            {/* Buttons at the bottom of the screen */}
            <div className="button-container">
                <button onClick={handleHomeButtonClick}>Home</button>
                <button onClick={handleProfileButtonClick}>Profile</button>
            </div>

            <style jsx>{`
                .profile-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100vh;
                    padding: 20px;
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

export default NewPage;
