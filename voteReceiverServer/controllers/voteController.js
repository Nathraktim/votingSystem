module.exports.submitVote = async (req, res) => {
    const { userId, answer, formId } = req.body;

    if (!userId || !answer || !formId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const result = await req.pool.query(
            'INSERT INTO votes(user_id, answer, form_id, submitted_at) VALUES($1, $2, $3, NOW()) RETURNING *',
            [userId, answer, formId]
        );

        return res.status(200).json({
            message: 'Vote submitted successfully',
            vote: result.rows[0],
        });
    } catch (error) {
        console.error('Error submitting vote:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};