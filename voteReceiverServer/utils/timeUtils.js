exports.checkTimeout = (createdAt, maxTime) => {
    const expirationTime = new Date(createdAt).getTime() + maxTime * 60 * 1000;
    return Date.now() < expirationTime;
};