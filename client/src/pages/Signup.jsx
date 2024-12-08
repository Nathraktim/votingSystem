import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Signup( {onSignup , onLogin}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const [token , setToken] = useState(localStorage.getItem('token'))

    const handleSignupSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('https://votingsystem-du6f.onrender.com/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
            const data = await response.json()
            if (response.ok) {
                onSignup(data.token)
            } else {
                alert(data.error)
            }
        } catch (error) {
            console.error('Signup error:', error)
            alert('An error occurred during signup')
        }
    }
    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('https://votingsystem-du6f.onrender.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
            const data = await response.json()
            if (response.ok) {
                onLogin(data.token)
            } else {
                alert(data.error)
            }
        } catch (error) {
            console.error('Login error:', error)
            alert('An error occurred during login')
        }
    }

    return (
        <div className={"flex flex-col sm:flex-row justify-center w-screen h-[100vh]"}>
            <div className={"w-auto h-auto"}>
                <div className="max-w-md mx-auto p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-4 text-white">Sign Up</h2>
                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block mb-1 text-white">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-1 text-white">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                            Sign Up
                        </button>
                    </form>
                </div>
                <div className="max-w-md mx-auto p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-4 text-white">Login</h2>
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block mb-1 text-white">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-1 text-white">Password:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup
