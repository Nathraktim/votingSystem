const { getNextUnresolvedEvent, markEventAsResolved } = require('../utils/allocatorUtils');
const axios = require('axios');
exports.allocateEvent = async (req, res, next) => {
    try {
        const event = await getNextUnresolvedEvent();
        if (!event) {
            return res.status(404).json({ message: 'No unresolved events available' });
        }
        const response = await axios.post(`http://voteReceiverServerURL/receiveEvent`, event);
        if (response.status === 200) {
            await markEventAsResolved(event.id);
            res.status(200).json({ message: 'Event allocated and resolved successfully' });
        } else {
            res.status(500).json({ message: 'Error in VoteReceiverServer processing' });
        }
    } catch (err) {
        next(err);
    }
};
