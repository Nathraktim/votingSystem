const pool = require('../db');

exports.createPoll = async (req, res) => {
    try {
        const { question, options, maxTime } = req.body;
        const userId = req.user.id;

        const result = await pool.query(
            'INSERT INTO polls (user_id, question, options, max_time) VALUES ($1, $2, $3, $4) RETURNING id',
            [userId, question, JSON.stringify(options), maxTime]
        );

        res.status(201).json({ message: 'Poll created', pollId: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: 'Internal userServer error' });
    }
};

exports.getPolls = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query('SELECT * FROM polls WHERE user_id = $1', [userId]);

        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Internal userServer error' });
    }
};