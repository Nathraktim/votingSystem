const pool = require('../db');
exports.addVote = async (eventId, voteOption) => {
    try {
        const result = await pool.query(
            'INSERT INTO votes (event_id, vote_option) VALUES ($1, $2) RETURNING *',
            [eventId, voteOption]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error('Error adding vote');
    }
};
exports.getVoteResults = async (eventId) => {
    try {
        const result = await pool.query(
            'SELECT vote_option, COUNT(*) as count FROM votes WHERE event_id = $1 GROUP BY vote_option ORDER BY count DESC',
            [eventId]
        );
        return result.rows;
    } catch (err) {
        throw new Error('Error fetching vote results');
    }
};
exports.isTimeoutReached = async (eventId) => {
    try {
        const result = await pool.query(
            'SELECT created_at, timeout_duration FROM events WHERE id = $1',
            [eventId]
        );
        const event = result.rows[0];
        if (!event) {
            throw new Error('Event not found');
        }

        const eventEndTime = new Date(event.created_at).getTime() + event.timeout_duration * 60 * 1000;
        const currentTime = new Date().getTime();

        return currentTime > eventEndTime;
    } catch (err) {
        throw new Error('Error checking event timeout');
    }
};