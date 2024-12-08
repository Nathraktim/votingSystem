import React, { useState, useEffect } from 'react'

function ViewPoll({ pollUrl, token }) {
    const [poll, setPoll] = useState(null)
    const [selectedOption, setSelectedOption] = useState('')
    const [hasVoted, setHasVoted] = useState(false)

    useEffect(() => {
        fetchPoll()
    }, [pollUrl])

    const fetchPoll = async () => {
        try {
            const uniqueCode = pollUrl.split('/').pop();
            console.log(uniqueCode);
            const response = await fetch(`https://votingsystem-du6f.onrender.com/api/poll/${uniqueCode}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            const data = await response.json()
            if (response.ok) {
                setPoll(data)
            } else {
                alert(data.error)
            }
        } catch (error) {
            console.error('Fetch poll error:', error)
            alert('An error occurred while fetching the poll')
        }
    }

    const handleVote = async () => {
        if (!selectedOption) return

        try {
            const uniqueCode = pollUrl.split('/').pop()
            const response = await fetch(`https://votingsystem-du6f.onrender.com/api/vote/${uniqueCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ option: selectedOption }),
            })
            const data = await response.json()
            if (response.ok) {
                setHasVoted(true)
                fetchPoll() // Refresh poll data
            } else {
                alert(data.error)
            }
        } catch (error) {
            console.error('Voting error:', error)
            alert('An error occurred while submitting your vote')
        }
    }

    if (!poll) return <div>Loading...</div>

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>
            {poll.isExpired ? (
                <p className="text-red-500">This poll has expired.</p>
            ) : (
                <>
                    {!hasVoted ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleVote(); }} className="space-y-4">
                            {poll.options.map((option, index) => (
                                <div key={index} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`option-${index}`}
                                        name="poll-option"
                                        value={option.text}
                                        checked={selectedOption === option.text}
                                        onChange={(e) => setSelectedOption(e.target.value)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`option-${index}`}>{option.text}</label>
                                </div>
                            ))}
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" disabled={!selectedOption}>
                                Vote
                            </button>
                        </form>
                    ) : (
                        <p className="text-green-500">Thank you for voting!</p>
                    )}
                </>
            )}
            {poll.isCreator && (
                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-2">Results:</h3>
                    {poll.options.map((option, index) => (
                        <div key={index} className="flex justify-between">
                            <span>{option.text}:</span>
                            <span>{option.votes} votes</span>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-4">
                <p className="text-sm text-gray-500">
                    Poll expires at: {new Date(poll.expiresAt).toLocaleString()}
                </p>
            </div>
        </div>
    )
}

export default ViewPoll