const pool = require('../db');

exports.addEvent = async (req, res, next) => {
    try {
        const { pollId, userId, options } = req.body;
        const result = await pool.query(
            `INSERT INTO queue (poll_id, user_id, options, resolved) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [pollId, userId, options, false]
        );
        res.status(201).json({ message: 'Event added to queue', event: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

exports.getUnresolvedEvents = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM queue WHERE resolved = false ORDER BY created_at ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        next(err);
    }
};
exports.markEventResolved = async (req, res, next) => {
    try {
        const { eventId } = req.params;

        const result = await pool.query(
            'UPDATE queue SET resolved = true WHERE id = $1 RETURNING *',
            [eventId]
        );
        if (result.rowCount === 0) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json({ message: 'Event marked as resolved', event: result.rows[0] });
    } catch (err) {
        next(err);
    }
};
