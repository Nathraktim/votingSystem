import React, { useState } from 'react'
import Signup from './pages/Signup.jsx'
import CreatePoll from './pages/CreatePoll'
import ViewPoll from './pages/ViewPoll'

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [currentPoll, setCurrentPoll] = useState(null)

    const handleSignup = (newToken) => {
        setToken(newToken)
        localStorage.setItem('token', newToken)
    }

    const handlePollCreated = (pollUrl) => {
        setCurrentPoll(pollUrl)
    }

    return (
        <div className="">
            {!token && <Signup onSignup={handleSignup} />}
            {token && !currentPoll && <CreatePoll token={token} onPollCreated={handlePollCreated} />}
            {currentPoll && <ViewPoll pollUrl={currentPoll} token={token} />}
        </div>
    )
}

export default App