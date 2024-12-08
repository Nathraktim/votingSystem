import React, { useState, useEffect } from 'react';

function ViewPoll({ pollUrl, token }) {
    const [poll, setPoll] = useState(null);
    const [URL, setURL] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [hasVoted, setHasVoted] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        fetchPoll(); // Initial fetch
        let interval;

        if (poll && poll.isCreator) {
            interval = setInterval(() => {
                fetchPoll(); // Fetch every 3 seconds if the user is the creator
            }, 3000);
        }

        return () => {
            clearInterval(interval); // Clean up the interval on unmount or if `poll` changes
        };
    }, [pollUrl, poll]);

    const fetchPoll = async () => {
        try {
            const uniqueCode = pollUrl.split('/').pop();
            console.log(uniqueCode);
            const response = await fetch(`https://votingsystem-du6f.onrender.com/api/poll/${uniqueCode}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setPoll(data);
                setURL(`https://voting-system-ecru.vercel.app/${uniqueCode}`);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Fetch poll error:', error);
            alert('An error occurred while fetching the poll');
        }
    };

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
        if (!selectedOption) return;

        try {
            const uniqueCode = pollUrl.split('/').pop();
            const response = await fetch(`https://votingsystem-du6f.onrender.com/api/vote/${uniqueCode}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ option: selectedOption }),
            });
            const data = await response.json();
            if (response.ok) {
                setHasVoted(true);
                fetchPoll(); // Refresh the poll data after voting
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Voting error:', error);
            alert('An error occurred while submitting your vote');
        }
    };

    if (!poll) return <div>Loading...</div>;

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
                                      d="M7.57833 10.7312C7.66442 10.6452 7.7327 10.543 7.77929 10.4305C7.82588 10.318 7.84986 10.1975 7.84986 10.0758C7.84986 9.95403 7.82588 9.83349 7.77929 9.72103C7.7327 9.60856 7.66442 9.50637 7.57833 9.4203C7.33648 9.17848 7.14464 8.89139 7.01376 8.57542C6.88287 8.25946 6.8155 7.92081 6.8155 7.57882C6.8155 7.23682 6.88287 6.89817 7.01376 6.58221C7.14464 6.26625 7.33648 5.97916 7.57833 5.73733L10.7 2.6167C10.9418 2.37488 11.229 2.18305 11.5449 2.05217C11.8609 1.9213 12.1996 1.85394 12.5416 1.85394C12.8836 1.85394 13.2223 1.9213 13.5382 2.05217C13.8542 2.18305 14.1413 2.37488 14.3832 2.6167C14.625 2.85853 14.8168 3.14562 14.9477 3.46158C15.0786 3.77754 15.146 4.11619 15.146 4.45818C15.146 4.80018 15.0786 5.13883 14.9477 5.45479C14.8168 5.77075 14.625 6.05784 14.3832 6.29967L13.4182 7.26366C13.3321 7.34974 13.2639 7.45193 13.2173 7.56439C13.1707 7.67686 13.1467 7.7974 13.1467 7.91913C13.1467 8.04086 13.1707 8.1614 13.2173 8.27386C13.2639 8.38633 13.3321 8.48852 13.4182 8.5746C13.5921 8.74844 13.8279 8.8461 14.0737 8.8461C14.1955 8.8461 14.316 8.82212 14.4285 8.77554C14.541 8.72895 14.6431 8.66067 14.7292 8.5746L15.6942 7.6106C16.5303 6.77453 17 5.64057 17 4.45818C17 3.2758 16.5303 2.14184 15.6942 1.30577C14.858 0.4697 13.724 0 12.5416 0C11.3591 0 10.2251 0.4697 9.38901 1.30577L6.26733 4.4264C5.85331 4.84038 5.52489 5.33184 5.30083 5.87273C5.07676 6.41363 4.96143 6.99336 4.96143 7.57882C4.96143 8.16428 5.07676 8.74401 5.30083 9.2849C5.52489 9.8258 5.85331 10.3173 6.26733 10.7312C6.62929 11.0932 7.21637 11.0932 7.57833 10.7312ZM9.38812 6.29967C9.30204 6.38574 9.23377 6.48794 9.18719 6.6004C9.1406 6.71287 9.11663 6.83342 9.11663 6.95515C9.11663 7.07688 9.1406 7.19742 9.18719 7.30989C9.23377 7.42235 9.30204 7.52455 9.38812 7.61062C9.67712 7.89961 9.892 8.20807 10.0271 8.54153C10.1621 8.875 10.2129 9.22658 10.1764 9.57549C10.1399 9.92441 10.0173 10.2683 9.8181 10.5563C9.61886 10.8443 9.34446 11.0707 9.02705 11.2195C8.70964 11.3683 8.34583 11.4401 8.0209 11.4069C7.69598 11.3737 7.38668 11.2464 7.09155 11.0523C6.79642 10.8582 6.52879 10.6004 6.30362 10.2893C6.07846 9.97821 5.89943 9.61892 5.79018 9.23751C5.68093 8.8561 5.64325 8.45126 5.68087 8.05089C5.71849 7.65051 5.82377 7.26891 5.99158 6.93341C6.15938 6.59791 6.37591 6.31223 6.62412 6.09521L9.38812 6.29967Z" fill="#303030"/>
                            </svg>
                        </div>
                    </div>
                    {isCopied && (
                        <div className="absolute top-5 right-10 text-sm bg-green-500 text-white px-4 py-1 rounded">
                            Link copied!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ViewPoll;
