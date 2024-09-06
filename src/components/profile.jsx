import React from 'react';
import { useUserStore } from "../lib/userStore";

const Profile = () => {
    const { currentUser } = useUserStore();

    return (
        <div className="profile-container">
            <h1>User Profile</h1>
            {currentUser ? (
                <div>
                    <p>Email: {currentUser.email}</p>
                    {/* Add more user details as needed */}
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default Profile;