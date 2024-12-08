import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import App from './App.jsx';
import ViewPoll from './pages/ViewPoll.jsx';
import './index.css';

function PollRouteWrapper() {
    const { id } = useParams();
    const pollUrl = `http://localhost:5173/${id}`; // Dynamically construct pollUrl
    return <ViewPoll pollUrl={pollUrl} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/:id" element={<PollRouteWrapper />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
