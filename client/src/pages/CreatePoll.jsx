import React, { useState } from 'react'

function CreatePoll({ token, onPollCreated }) {
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState(['', ''])
    const [expiresAt, setExpiresAt] = useState('')

    const handleAddOption = () => {
        setOptions([...options, ''])
    }

    const handleOptionChange = (index, value) => {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('https://votingsystem-du6f.onrender.com/api/create-poll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    question,
                    options: options.filter(option => option.trim() !== ''),
                    expiresAt: new Date(expiresAt).toISOString(),
                }),
            })
            const data = await response.json()
            if (response.ok) {
                onPollCreated(data.pollUrl)
            } else {
                alert(data.error)
            }
        } catch (error) {
            console.error('Poll creation error:', error)
            alert('An error occurred while creating the poll')
        }
    }

    return (
        <div className={"w-screen h-[100vh] bg-[#2B2B2B]"}>
            <div className={"header "}></div>
            <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Create a Poll</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="question" className="block mb-1">Question:</label>
                        <input
                            type="text"
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    {options.map((option, index) => (
                        <div key={index}>
                            <label htmlFor={`option-${index}`} className="block mb-1">Option {index + 1}:</label>
                            <input
                                type="text"
                                id={`option-${index}`}
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddOption}
                            className="w-full bg-gray-200 py-2 rounded hover:bg-gray-300">
                        Add Option
                    </button>
                    <div>
                        <label htmlFor="expiresAt" className="block mb-1">Expires At:</label>
                        <input
                            type="datetime-local"
                            id="expiresAt"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                        Create Poll
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreatePoll