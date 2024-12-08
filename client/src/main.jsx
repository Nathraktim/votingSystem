import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import App from './App.jsx';
import Signup from './pages/Signup.jsx';
import ViewPoll from './pages/ViewPoll.jsx';
import './index.css';

function PollRouteWrapper() {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const { id } = useParams();
    const pollUrl = `https://voting-system-ecru.vercel.app/${id}`;
    console.log(pollUrl);
    return <ViewPoll pollUrl={pollUrl} token={token} />;
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
