
import React from "react";
import "./userInfo.css"; // Assuming you create a separate CSS file for this component

const VideoPopup = ({ onClose }) => {
    return (
        <div className="popup">
            <div className="popupContent">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Video Call</h3>
                <p>Video call functionality goes here...</p>
            </div>
        </div>
    );
}

export default VideoPopup;