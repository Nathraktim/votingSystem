import React, { useState, useEffect } from 'react'

function ViewPoll({ pollUrl, token }) {
    const [poll, setPoll] = useState(null)
    const [URL, setURL] = useState('')
    const [selectedOption, setSelectedOption] = useState('')
    const [hasVoted, setHasVoted] = useState(false)
    const [isCopied, setIsCopied] = useState(false);

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
                setURL(`https://voting-system-ecru.vercel.app/${uniqueCode}`);
            } else {
                alert(data.error)
            }
        } catch (error) {
            console.error('Fetch poll error:', error)
            alert('An error occurred while fetching the poll')
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(URL)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 2000); // Hide popup after 2 seconds
            })
            .catch((error) => {
                console.error("Failed to copy text:", error);
            });
    };

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
                fetchPoll()
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
                    <div className={"flex flex-row gap-2"}>
                        <h4>{URL}</h4>
                        <div onClick={handleCopy}>
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M7.57833 10.7312C7.66442 10.6452 7.7327 10.543 7.77929 10.4305C7.82588 10.318 7.84986 10.1975 7.84986 10.0758C7.84986 9.95403 7.82588 9.83349 7.77929 9.72103C7.7327 9.60856 7.66442 9.50637 7.57833 9.4203C7.33648 9.17848 7.14464 8.89139 7.01376 8.57542C6.88287 8.25946 6.8155 7.92081 6.8155 7.57882C6.8155 7.23682 6.88287 6.89817 7.01376 6.58221C7.14464 6.26625 7.33648 5.97916 7.57833 5.73733L10.7 2.6167C10.9418 2.37488 11.229 2.18305 11.5449 2.05217C11.8609 1.9213 12.1996 1.85394 12.5416 1.85394C12.8836 1.85394 13.2223 1.9213 13.5382 2.05217C13.8542 2.18305 14.1413 2.37488 14.3832 2.6167C14.625 2.85853 14.8168 3.14562 14.9477 3.46158C15.0786 3.77754 15.146 4.11619 15.146 4.45818C15.146 4.80018 15.0786 5.13883 14.9477 5.45479C14.8168 5.77075 14.625 6.05784 14.3832 6.29967L13.4182 7.26366C13.3321 7.34974 13.2639 7.45193 13.2173 7.56439C13.1707 7.67686 13.1467 7.7974 13.1467 7.91913C13.1467 8.04086 13.1707 8.1614 13.2173 8.27386C13.2639 8.38633 13.3321 8.48852 13.4182 8.5746C13.5921 8.74844 13.8279 8.8461 14.0737 8.8461C14.1955 8.8461 14.316 8.82212 14.4285 8.77554C14.541 8.72895 14.6431 8.66067 14.7292 8.5746L15.6942 7.6106C16.5303 6.77453 17 5.64057 17 4.45818C17 3.2758 16.5303 2.14184 15.6942 1.30577C14.858 0.4697 13.724 0 12.5416 0C11.3591 0 10.2251 0.4697 9.38901 1.30577L6.26733 4.4264C5.85331 4.84038 5.52489 5.33184 5.30083 5.87273C5.07676 6.41363 4.96143 6.99336 4.96143 7.57882C4.96143 8.16428 5.07676 8.74401 5.30083 9.2849C5.52489 9.8258 5.85331 10.3173 6.26733 10.7312C6.62929 11.0932 7.21637 11.0932 7.57833 10.7312ZM9.38812 6.29967C9.30204 6.38574 9.23375 6.48793 9.18716 6.60039C9.14057 6.71286 9.11659 6.8334 9.11659 6.95513C9.11659 7.07687 9.14057 7.19741 9.18716 7.30987C9.23375 7.42234 9.30204 7.52452 9.38812 7.6106C9.62997 7.85242 9.82181 8.13951 9.9527 8.45547C10.0836 8.77144 10.1509 9.11008 10.1509 9.45208C10.1509 9.79408 10.0836 10.1327 9.9527 10.4487C9.82181 10.7646 9.62997 11.0517 9.38812 11.2936L6.29823 14.3833C6.05767 14.6308 5.77031 14.828 5.45285 14.9635C5.1354 15.0989 4.79418 15.17 4.44903 15.1724C4.10389 15.1748 3.7617 15.1086 3.44237 14.9777C3.12303 14.8467 2.83291 14.6536 2.58888 14.4095C2.34485 14.1654 2.15177 13.8753 2.02087 13.5559C1.88997 13.2366 1.82386 12.8944 1.82638 12.5492C1.8289 12.2041 1.9 11.8629 2.03555 11.5455C2.1711 11.2281 2.36839 10.9408 2.61596 10.7003L3.52085 9.79548C3.6947 9.62164 3.79237 9.38586 3.79237 9.14002C3.79237 8.89417 3.6947 8.65839 3.52085 8.48455C3.347 8.31071 3.11121 8.21305 2.86535 8.21305C2.61949 8.21305 2.3837 8.31071 2.20986 8.48455L1.30584 9.3894C0.469725 10.2255 0 11.3594 0 12.5418C0 13.7242 0.469725 14.8582 1.30584 15.6942C2.14196 16.5303 3.27597 17 4.45842 17C5.64086 17 6.77488 16.5303 7.61099 15.6942L10.7009 12.6045C11.1149 12.1905 11.4433 11.6991 11.6674 11.1582C11.8915 10.6173 12.0068 10.0375 12.0068 9.45208C12.0068 8.86662 11.8915 8.28689 11.6674 7.74599C11.4433 7.2051 11.1149 6.71364 10.7009 6.29967C10.6148 6.21358 10.5126 6.1453 10.4001 6.09871C10.2877 6.05212 10.1671 6.02814 10.0454 6.02814C9.92365 6.02814 9.8031 6.05212 9.69063 6.09871C9.57816 6.1453 9.47597 6.21358 9.38989 6.29967H9.38812Z"
                                      fill="black"/>
                            </svg>
                        </div>
                        {isCopied && (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: '#28a745',
                                color: '#fff',
                                padding: '10px',
                                borderRadius: '5px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            }}>
                                Copied to clipboard!
                            </div>
                        )}
                    </div>
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