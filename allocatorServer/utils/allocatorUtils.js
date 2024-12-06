const pool = require('../db');
exports.getNextUnresolvedEvent = async () => {
    try {
        const result = await pool.query(
            'SELECT * FROM queue WHERE resolved = false ORDER BY created_at ASC LIMIT 1'
        );
        return result.rows[0];
    } catch (err) {
        throw new Error('Error fetching next unresolved event');
    }
};
exports.markEventAsResolved = async (eventId) => {
    try {
        const result = await pool.query(
            'UPDATE queue SET resolved = true WHERE id = $1 RETURNING *',
            [eventId]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error('Error marking event as resolved');
    }
};
