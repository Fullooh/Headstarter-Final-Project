import React from 'react';
import { useNavigate } from "react-router-dom";

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
        <div className="profile-container">
            <h1>SyncUp</h1>
            {/* Centered 5x3 block for Tinder clone */}
            <div className="central-block">
                <img
                    src={`https://via.placeholder.com/450x270?text=User+Photo`}
                    alt="User"
                    className="user-photo"
                />
                <div className="button-group">
                    <button onClick={handleLike}>Like</button>
                    <button onClick={handleDislike}>Dislike</button>
                </div>
            </div>

            {/* Buttons at the bottom of the screen */}
            <div className="button-container">
                <button onClick={handleHomeButtonClick}>Home</button>
                <button onClick={handleProfileButtonClick}>Profile</button>
            </div>

            <style jsx>{`
                .profile-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 1000px;
                    text-align: center;
                    position: relative;
                    left: 750px; /* Move the container to the right */
                }

                .central-block {
                    width: 500px;
                    height: 900px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background-color: #333;
                    border-radius: 15px;
                    padding: 20px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }

                .user-photo {
                    width: 100%;
                    height: auto;
                    margin-bottom: 10px;
                    border-radius: 10px;
                }

                .button-group {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                }

                .button-group button {
                    padding: 10px;
                    font-size: 16px;
                    cursor: pointer;
                    margin: 5px;
                    flex: 1;
                }

                .button-container {
                    position: absolute;
                    bottom: 80px;
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
}
export default NewPage;