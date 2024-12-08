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
                    <div className={"flex flex-row"}>
                        <h4>{URL}</h4>
                        <div onClick={handleCopy}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M5.34941 7.57499C5.41018 7.51423 5.45838 7.4421 5.49127 7.36271C5.52415 7.28332 5.54108 7.19823 5.54108 7.1123C5.54108 7.02638 5.52415 6.94129 5.49127 6.8619C5.45838 6.78251 5.41018 6.71038 5.34941 6.64962C5.17869 6.47892 5.04328 6.27627 4.95089 6.05324C4.8585 5.83021 4.81094 5.59116 4.81094 5.34975C4.81094 5.10834 4.8585 4.8693 4.95089 4.64627C5.04328 4.42323 5.17869 4.22058 5.34941 4.04988L7.55294 1.84708C7.72365 1.67638 7.92632 1.54098 8.14936 1.44859C8.37241 1.35621 8.61146 1.30866 8.85288 1.30866C9.0943 1.30866 9.33336 1.35621 9.5564 1.44859C9.77945 1.54098 9.98211 1.67638 10.1528 1.84708C10.3235 2.01779 10.4589 2.22044 10.5513 2.44347C10.6437 2.6665 10.6913 2.90555 10.6913 3.14695C10.6913 3.38836 10.6437 3.62741 10.5513 3.85044C10.4589 4.07347 10.3235 4.27612 10.1528 4.44682L9.47169 5.12729C9.41093 5.18805 9.36273 5.26019 9.32984 5.33957C9.29696 5.41896 9.28003 5.50405 9.28003 5.58997C9.28003 5.6759 9.29696 5.76099 9.32984 5.84038C9.36273 5.91976 9.41093 5.9919 9.47169 6.05266C9.59441 6.17537 9.76085 6.2443 9.9344 6.2443C10.0203 6.2443 10.1054 6.22738 10.1848 6.1945C10.2642 6.16161 10.3363 6.11342 10.3971 6.05266L11.0782 5.37219C11.6684 4.78202 12 3.98158 12 3.14695C12 2.31233 11.6684 1.51189 11.0782 0.921721C10.488 0.331553 9.68755 0 8.85288 0C8.01821 0 7.21773 0.331553 6.62753 0.921721L4.424 3.12452C4.13175 3.41674 3.89992 3.76365 3.74176 4.14546C3.58359 4.52727 3.50219 4.93649 3.50219 5.34975C3.50219 5.76302 3.58359 6.17224 3.74176 6.55405C3.89992 6.93586 4.13175 7.28277 4.424 7.57499C4.6795 7.83047 5.09391 7.83047 5.34941 7.57499ZM6.62691 4.44682C6.56614 4.50758 6.51794 4.57971 6.48505 4.6591C6.45217 4.73849 6.43524 4.82358 6.43524 4.90951C6.43524 4.99543 6.45217 5.08052 6.48505 5.15991C6.51794 5.2393 6.56614 5.31143 6.62691 5.37219C6.79762 5.54289 6.93304 5.74554 7.02543 5.96857C7.11782 6.1916 7.16538 6.43065 7.16538 6.67206C7.16538 6.91347 7.11782 7.15251 7.02543 7.37554C6.93304 7.59858 6.79762 7.80123 6.62691 7.97193L4.44581 10.1529C4.276 10.3276 4.07316 10.4668 3.84907 10.5625C3.62499 10.6581 3.38413 10.7082 3.14049 10.7099C2.89686 10.7116 2.65532 10.6649 2.42991 10.5725C2.20449 10.48 1.9997 10.3437 1.82745 10.1714C1.65519 9.99911 1.5189 9.7943 1.4265 9.56887C1.3341 9.34345 1.28743 9.10191 1.28921 8.85829C1.29099 8.61467 1.34118 8.37384 1.43686 8.14978C1.53254 7.92573 1.6718 7.72293 1.84656 7.55318L2.48531 6.91446C2.60803 6.79175 2.67697 6.62532 2.67697 6.45178C2.67697 6.27824 2.60803 6.11181 2.48531 5.9891C2.36259 5.86638 2.19615 5.79745 2.0226 5.79745C1.84905 5.79745 1.68261 5.86638 1.5599 5.9891L0.921769 6.62781C0.33157 7.21798 0 8.01842 0 8.85305C0 9.68767 0.33157 10.4881 0.921769 11.0783C1.51197 11.6684 2.31245 12 3.14712 12C3.98178 12 4.78227 11.6684 5.37247 11.0783L7.55357 8.89729C7.84582 8.60507 8.07764 8.25816 8.23581 7.87635C8.39397 7.49454 8.47538 7.08532 8.47538 6.67206C8.47538 6.25879 8.39397 5.84957 8.23581 5.46776C8.07764 5.08595 7.84582 4.73904 7.55357 4.44682C7.49281 4.38606 7.42067 4.33786 7.34128 4.30497C7.26189 4.27209 7.1768 4.25516 7.09086 4.25516C7.00493 4.25516 6.91984 4.27209 6.84045 4.30497C6.76105 4.33786 6.68892 4.38606 6.62816 4.44682H6.62691Z"
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