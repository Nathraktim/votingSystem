const pool = require('../db');
exports.hasUnresolvedEvents = async () => {
    try {
        const result = await pool.query('SELECT COUNT(*) FROM queue WHERE resolved = false');
        return parseInt(result.rows[0].count) > 0;
    } catch (err) {
        throw new Error('Error checking unresolved events');
    }
};
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
exports.formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;
};