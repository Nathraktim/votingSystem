import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx"
import './App.css'
function App() {

  return (
        <BrowserRouter>
            <Routes>
                {/*<Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" />} />*/}
                {/*<Route path="/home" element={!isLoggedIn ? <Home /> : <Navigate to="/" />} />*/}
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element=<Home /> />
            </Routes>
        </BrowserRouter>
  )
}

export default App
