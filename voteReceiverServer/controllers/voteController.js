const pool = require('../db');
const { checkTimeout } = require('../utils/timeUtils');

exports.submitVote = async (req, res, next) => {
    try {
        const { pollId, selectedOption } = req.body;
        const userIP = req.ip;
        const poll = await pool.query('SELECT * FROM polls WHERE id = $1', [pollId]);
        if (poll.rowCount === 0) return res.status(404).json({ error: 'Poll not found' });
        if (!checkTimeout(poll.rows[0].created_at, poll.rows[0].max_time)) {
            return res.status(403).json({ error: 'Poll has expired' });
        }
        const ipCheck = await pool.query('SELECT * FROM votes WHERE poll_id = $1 AND ip_address = $2', [
            pollId,
            userIP,
        ]);
        if (ipCheck.rowCount > 0) {
            return res.status(403).json({ error: 'You have already voted' });
        }
        await pool.query(
            'INSERT INTO votes (poll_id, selected_option, ip_address) VALUES ($1, $2, $3)',
            [pollId, selectedOption, userIP]
        );
        res.status(201).json({ message: 'Vote submitted successfully' });
    } catch (err) {
        next(err);
    }
};