import React, { useState , useEffect } from 'react'

function CreatePoll({ token, onPollCreated }) {
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState(['', ''])
    const [expiresAt, setExpiresAt] = useState('')

    const handleAddOption = () => {
        setOptions([...options, ''])
    }

    useEffect(() => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
        setExpiresAt(formattedDate);
    }, []);

    const handleInputClick = () => {
        document.querySelector("#datetime-input").showPicker();
    };

    const formatDateForDisplay = (date) => {
        if (!date) return "Select Date & Time";

        const now = new Date();
        const targetDate = new Date(date);
        const diffInDays = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
        const hours = targetDate.getHours();
        const minutes = targetDate.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${ampm}`;

        if (now.toDateString() === targetDate.toDateString()) {
            return `Today, ${formattedTime}`;
        }
        if (diffInDays === 1) {
            return `Tomorrow, ${formattedTime}`;
        }
        if (diffInDays === -1) {
            return `Yesterday, ${formattedTime}`;
        }
        if (diffInDays > 1 && diffInDays <= 7) {
            return `${targetDate.toLocaleDateString(undefined, { weekday: "long" })}, ${formattedTime}`;
        }
        if (diffInDays < -1 && diffInDays >= -7) {
            return `Last ${targetDate.toLocaleDateString(undefined, { weekday: "long" })}, ${formattedTime}`;
        }
        return targetDate.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) +
            `, ${formattedTime}`;
    };


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
        <div className={"w-screen bg-[#2B2B2B]"}>
            <div className={"header w-full h-32 sm:h-[24vh] flex justify-center align-middle"}>
                <div className={"w-full max-w-[1400px] h-full flex flex-row justify-between px-10"}>
                    <div className={"logo flex flex-row items-center gap-3"}>
                        <div className={"name text-white font-helvetica text-[70px] font-medium hidden sm:block"}>Vote
                        </div>
                        <div className={"logoSvg h-10 sm:h-auto"}>
                            <svg className="h-full w-auto" viewBox="0 0 68 51" width="68" height="51" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0 32.0899C0 28.8806 0 27.276 0.553101 26.0502C1.03962 24.9719 1.81594 24.0953 2.77079 23.5459C3.85632 22.9213 5.27735 22.9213 8.1194 22.9213H10.1493C12.9913 22.9213 14.4123 22.9213 15.4979 23.5459C16.4527 24.0953 17.229 24.9719 17.7156 26.0502C18.2687 27.276 18.2687 28.8806 18.2687 32.0899V41.8315C18.2687 45.0407 18.2687 46.6454 17.7156 47.8712C17.229 48.9494 16.4527 49.826 15.4979 50.3754C14.4123 51 12.9913 51 10.1493 51H8.1194C5.27735 51 3.85632 51 2.77079 50.3754C1.81594 49.826 1.03962 48.9494 0.553101 47.8712C0 46.6454 0 45.0407 0 41.8315V32.0899Z"
                                    fill="#D9D9D9"/>
                                <path
                                    d="M24.8657 21.7753C24.8657 18.566 24.8657 16.9613 25.4188 15.7356C25.9053 14.6573 26.6816 13.7807 27.6365 13.2313C28.722 12.6067 30.143 12.6067 32.9851 12.6067H35.0149C37.857 12.6067 39.278 12.6067 40.3635 13.2313C41.3184 13.7807 42.0947 14.6573 42.5812 15.7356C43.1343 16.9613 43.1343 18.566 43.1343 21.7753V41.8315C43.1343 45.0407 43.1343 46.6454 42.5812 47.8712C42.0947 48.9494 41.3184 49.826 40.3635 50.3754C39.278 51 37.857 51 35.0149 51H32.9851C30.143 51 28.722 51 27.6365 50.3754C26.6816 49.826 25.9053 48.9494 25.4188 47.8712C24.8657 46.6454 24.8657 45.0407 24.8657 41.8315V21.7753Z"
                                    fill="#D9D9D9"/>
                                <path
                                    d="M49.7313 9.16854C49.7313 5.95925 49.7313 4.3546 50.2844 3.12882C50.771 2.05059 51.5473 1.17396 52.5021 0.624569C53.5877 0 55.0087 0 57.8507 0H59.8806C62.7227 0 64.1437 0 65.2292 0.624569C66.1841 1.17396 66.9604 2.05059 67.4469 3.12882C68 4.3546 68 5.95925 68 9.16854V41.8315C68 45.0407 68 46.6454 67.4469 47.8712C66.9604 48.9494 66.1841 49.826 65.2292 50.3754C64.1437 51 62.7227 51 59.8806 51H57.8507C55.0087 51 53.5877 51 52.5021 50.3754C51.5473 49.826 50.771 48.9494 50.2844 47.8712C49.7313 46.6454 49.7313 45.0407 49.7313 41.8315V9.16854Z"
                                    fill="#D9D9D9"/>
                            </svg>
                        </div>
                    </div>
                    <div className={"profile flex flex-row items-center gap-3"}>
                        <div className={"profileLogo h-16"}>
                            <svg className="h-full w-auto" width="106" height="106" viewBox="0 0 106 106" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <circle cx="53" cy="53" r="53" fill="#D9D9D9"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"mainBody flex justify-center align-middle mb-10"}>
                <div className={"max-w-[1500px] flex flex-col lg:flex-row items-center gap-5"}>
                    <div className={"questionComp flex flex-col"}>
                        <div className={"boxHeader text-[25px] font-helvetica font-medium text-white pb-5"}>Type your
                            question:
                        </div>
                        <div
                            className={"inputBox w-[90vw] sm:w-[600px] h-[350px] bg-[#515151] rounded-[22px] overflow-y-scroll scrollbar-width: none scrollbar-hidden"}>
                            <textarea
                                id="question"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                required
                                className="w-full h-full px-6 py-4 bg-[#515151] rounded-[22px] focus:outline-none text-[30px] font-medium font-helvetica text-white resize-none"
                            />
                        </div>
                    </div>
                    <div className={"optionsComp flex flex-col"}>
                        <div className={"boxHeader text-[25px] font-helvetica font-medium text-white pb-5"}>Set options:
                        </div>
                        <div
                            className={"optionsBox w-[90vw] sm:w-[600px] h-[350px] bg-[#515151] rounded-[22px] overflow-y-scroll"}>
                            <div className={"options space-y-4 px-6 py-4 scrollbar-width: none scrollbar-hidden"}>
                                {options.map((option, index) => (
                                    <div key={index}>
                                        <label htmlFor={`option-${index}`}
                                               className="block mb-1 text-white">Option {index + 1}:</label>
                                        <input
                                            type="text"
                                            id={`option-${index}`}
                                            value={option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            required
                                            className="w-full px-6 bg-[#5F5F5F] rounded-[10px] focus:outline-none text-[30px] font-medium font-helvetica text-white"
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddOption}
                                    className="w-full bg-[#424242] py-2 rounded hover:bg-gray-300 flex justify-center items-center"
                                >
                                    <svg width="26" height="25" viewBox="0 0 26 25" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M13 0C11.3431 0 10 1.34314 10 3V9.5H3.5C1.84314 9.5 0.5 10.8431 0.5 12.5C0.5 14.1569 1.84314 15.5 3.5 15.5H10V22C10 23.6569 11.3431 25 13 25C14.6569 25 16 23.6569 16 22V15.5H22.5C24.1569 15.5 25.5 14.1569 25.5 12.5C25.5 10.8431 24.1569 9.5 22.5 9.5H16V3C16 1.34314 14.6569 0 13 0Z"
                                            fill="#2CB557"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"configButtons flex justify-center align-middle"}>
                <div className={"max-w-[1220px] w-full flex flex-col lg:flex-row items-center gap-5 justify-between"}>
                    <div className={"setupTime flex flex-col sm:flex-row"}>
                        <div className={"naming flex flex-col sm:text-right"}>
                            <div className={"boxName font-helvetica font-medium sm:text-[25px] text-white"}>Set poll
                                uptime:
                            </div>
                            <div
                                className={"subInfo font-helvetica font-normal text-[13px] sm:text-[20px] text-[#7A7A7A]"}>(Default
                                1hour)
                            </div>
                        </div>
                        <div className={"expirationBox"}>
                            <div className="relative w-full">
                                <input
                                    type="datetime-local"
                                    id="expiresAt"
                                    value={expiresAt}
                                    onChange={(e) => setExpiresAt(e.target.value)}
                                    required
                                    className="w-full text-white bg-transparent py-2 px-4 shadow-sm
               hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-transparent
               text-left font-medium h-10 font-helvetica text-[18px] sm:text-[25px] appearance-none"
                                />
                                <div
                                    className="absolute inset-y-0 right-3 flex items-center pointer-events-none hidden sm:block">
                                    <svg width="56" height="52" viewBox="0 0 56 52" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <rect width="56" height="52" rx="11" fill="#424242"/>
                                        <path
                                            d="M46 25.5C46 35.165 38.165 43 28.5 43C18.835 43 11 35.165 11 25.5C11 15.835 18.835 8 28.5 8C33.0622 8 37.2166 9.74574 40.3317 12.6057C41.1666 13.3721 41.0814 14.6748 40.2436 15.438C39.3688 16.2351 38.0154 16.133 37.114 15.3661C34.7933 13.3915 31.7858 12.2 28.5 12.2C21.1546 12.2 15.2 18.1546 15.2 25.5C15.2 32.8454 21.1546 38.8 28.5 38.8C35.8454 38.8 41.8 32.8454 41.8 25.5C41.8 24.6586 42.3882 23.9014 43.2235 23.8002L43.8723 23.7215C44.9816 23.5871 46 24.3826 46 25.5Z"
                                            fill="#7A7A7A"/>
                                        <path
                                            d="M29.4448 15.5997C28.4134 15.3855 27.4391 16.2633 27.2688 17.5603L26.1583 26.0146C26.1207 26.301 26.1327 26.3052 26.1668 26.8532C26.1508 26.9446 26.1422 27.0385 26.1417 27.1344C26.1367 28.0486 26.865 28.7923 27.7683 28.7955L32.0582 28.8108C32.9615 28.814 33.6977 28.0755 33.7027 27.1614C33.7076 26.2472 32.9794 25.5035 32.0761 25.5003L30.0639 25.4931L31.0039 18.3361C31.1743 17.0391 30.4763 15.814 29.4448 15.5997Z"
                                            fill="#7A7A7A"/>
                                        <path
                                            d="M37.6024 25.0278C38.5886 25.0315 39.3838 25.8813 39.3784 26.926C39.3729 27.9706 38.5691 28.8145 37.5828 28.8108L37.3706 28.81C36.3843 28.8063 35.5892 27.9565 35.5946 26.9119C35.6 25.8672 36.4039 25.0234 37.3901 25.027L37.6024 25.0278Z"
                                            fill="#666666"/>
                                    </svg>
                                </div>
                            </div>

                        </div>
                    </div>
                    <button type="submit" className="bg-[#2CB557] text-white py-2 hover:bg-blue-600 text-[25px] font-medium font-helvetica px-3 rounded-[11px]">
                        Generate Link
                    </button>
                </div>
            </div>
            <div className="max-w-md mx-auto hidden text-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-4">Create a Poll</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className={"questionInputBox"}>
                        <label htmlFor="question" className="block mb-1">Type your question:</label>
                        <input
                            type="text"
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className={"options space-y-4"}>
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
                    </div>
                    <div className={"expirationBox"}>
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
                </form>
            </div>
        </div>
    )
}

export default CreatePoll