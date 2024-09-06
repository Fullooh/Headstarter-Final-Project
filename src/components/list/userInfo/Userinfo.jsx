// Userinfo.jsx
import React, { useState } from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import VideoPopup from "./syncup.jsx";
import EditPopup from "./editType.jsx";
import { auth } from "../../../lib/firebase.js";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const Userinfo = () => {
    const { currentUser, resetChat } = useUserStore();
    const [showPopup, setShowPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const navigate = useNavigate(); // Initialize the navigate function

    const handleVideoClick = () => {
        setShowPopup(true);
    };

    const handleEditClick = () => {
        setShowEditPopup(true);
    };

    const handleLogout = () => {
        auth.signOut();
        resetChat();
    };

    // Function to navigate to the profile
    const handleProfileClick = () => {
        navigate('/profile');
    };
    const handleNewPageClick = () => {
        navigate('/newPage');
    };


    return (
        <div className='userInfo'>
            <div className="user">
                <img src={currentUser.avatar || "./avatar.png"} alt=""/>
                <h2>{currentUser.username}</h2>
            </div>
            <div className="icons">
                <img src="./more.png" alt="" onClick={handleProfileClick}/> {/* Route to Profile */}
                <img src="./more.png" alt="" onClick={handleNewPageClick}/> {/* Route to Profile */}
                <img src="./video.png" alt="" onClick={handleVideoClick}/>
                <img src="./edit.png" alt="" onClick={handleEditClick}/>
            </div>
            <button className="logout" onClick={handleLogout}>
                Logout
            </button>
            {showPopup && <VideoPopup onClose={() => setShowPopup(false)}/>}
            {showEditPopup && <EditPopup onClose={() => setShowEditPopup(false)} />}
        </div>
    );
}

export default Userinfo;

