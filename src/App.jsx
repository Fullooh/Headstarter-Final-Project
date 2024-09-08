import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import Profile from "./components/profile"; // Import your SyncUp component
import NewPage from "./components/newPage"; // Import the new page component
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";

const App = () => {
    const { currentUser, isLoading, fetchUserInfo } = useUserStore();
    const { chatId } = useChatStore();

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
            fetchUserInfo(user?.uid);
        });

        return () => {
            unSub();
        };
    }, [fetchUserInfo]);

    if (isLoading) return <div className="loading">Loading...</div>;

    return (
        <Router>
            <div className="container">
                <Routes>
                    <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/profile" />} />
                    <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="/newPage" element={currentUser ? <NewPage /> : <Navigate to="/login" />} /> {/* Add new route */}
                    <Route
                        path="/"
                        element={
                            currentUser ? (
                                <>
                                    <List />
                                    {chatId && <Chat />}
                                    {chatId && <Detail />}
                                </>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                </Routes>
                <Notification />
            </div>
        </Router>
    );
};

export default App;
