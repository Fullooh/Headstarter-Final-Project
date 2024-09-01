// Userinfo.jsx
import React, { useState } from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import VideoPopup from "./syncup.jsx"; // Import the new component

const Userinfo = () => {
    const { currentUser } = useUserStore();
    const [showPopup, setShowPopup] = useState(false);

    const handleVideoClick = () => {
        setShowPopup(true);
    };

    return (
        <div className='userInfo'>
            <div className="user">
                <img src={currentUser.avatar || "./avatar.png"} alt="" />
                <h2>{currentUser.username}</h2>
            </div>
            <div className="icons">
                <img src="./more.png" alt="" />
                <img src="./video.png" alt="" onClick={handleVideoClick} />
                <img src="./edit.png" alt="" />
            </div>
            {showPopup && <VideoPopup onClose={() => setShowPopup(false)} />}
        </div>
    );
}

export default Userinfo;