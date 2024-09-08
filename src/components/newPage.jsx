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
    };

    const handleDislike = () => {
        console.log('Disliked!');
    };

    return (
        <div className="profile-container flex justify-center items-center min-h-screen bg-gray-800">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full text-center central-block">
                <img
                    className="w-32 h-32 rounded-full mx-auto mb-4 user-photo"
                    src="https://via.placeholder.com/150"
                    alt="Profile"
                />
                <h2 className="text-3xl font-bold mb-2">John Doe</h2>
                <p className="text-gray-600 mb-4">Software Engineer | AI Enthusiast</p>
                <p className="text-gray-800 mb-4">
                    Passionate about creating innovative solutions and learning new
                    technologies. Loves coding, problem-solving, and collaborating with
                    teams.
                </p>
                <div className="button-group flex justify-around mt-4">
                    <button className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600" onClick={handleLike}>
                        Like
                    </button>
                    <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600" onClick={handleDislike}>
                        Dislike
                    </button>
                </div>
            </div>

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
                    height: 100vh;
                    text-align: center;
                    position: relative;
                }

                .central-block {
                    width: 500px;
                    height: auto;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background-color: #fff;
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
};

export default NewPage;
