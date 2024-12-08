import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ViewPoll from './pages/ViewPoll.jsx';
import './index.css';

function PollRouteWrapper() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const { id } = useParams();  // Get the poll ID from the URL
    const pollUrl = `https://voting-system-ecru.vercel.app/${id}`;
    console.log(pollUrl);
    return <ViewPoll pollUrl={pollUrl} token={token} />;
}
function MainApp() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const handleLogin = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };
    const handleSignup = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
                <Route path="/:id" element={<PollRouteWrapper />} />
            </Routes>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <MainApp />
    </React.StrictMode>
);
