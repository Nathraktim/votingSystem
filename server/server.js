const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
        ca: fs.readFileSync('./ca.pem').toString(),
    },
});

// CORS configuration
const corsOptions = {
    origin: process.env.CLIENT_DOMAIN || 'http://localhost:5173', // Allow requests from the frontend
    optionsSuccessStatus: 200,
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.json());

// Helper function to generate a unique 8-character code
function generateUniqueCode() {
    return uuidv4().substr(0, 8);
}

// Step 1: User Signup
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
            [email, hashedPassword]
        );
        const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET);
        res.status(201).json({ token, email });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Step 2: Create Poll
app.post('/api/create-poll', async (req, res) => {
    const { question, options, expiresAt } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const uniqueCode = generateUniqueCode();

        const result = await pool.query(
            'INSERT INTO polls (user_id, question, unique_code, expires_at, options) VALUES ($1, $2, $3, $4, $5) RETURNING unique_code',
            [userId, question, uniqueCode, expiresAt, JSON.stringify({ options: options.map(opt => ({ text: opt, votes: 0 })) })]
        );

        const pollUrl = `${process.env.CLIENT_DOMAIN}/${result.rows[0].unique_code}`;
        res.status(201).json({ pollUrl });
    } catch (error) {
        console.error('Poll creation error:', error);
        res.status(500).json({ error: 'Error creating poll' });
    }
});

// Step 3: Vote on Poll
app.post('/api/vote/:uniqueCode', async (req, res) => {
    const { uniqueCode } = req.params;
    const { option } = req.body;
    const ipAddress = req.ip;

    try {
        // Check if poll exists and hasn't expired
        const pollResult = await pool.query(
            'SELECT * FROM polls WHERE unique_code = $1 AND expires_at > NOW()',
            [uniqueCode]
        );

        if (pollResult.rows.length === 0) {
            return res.status(404).json({ error: 'Poll not found or has expired' });
        }

        const poll = pollResult.rows[0];

        // Check if IP has already voted
        if (poll.voted_ips.includes(ipAddress)) {
            return res.status(400).json({ error: 'You have already voted on this poll' });
        }

        // Update vote count and add IP to voted list
        const updatedOptions = poll.options;
        const optionIndex = updatedOptions.options.findIndex(opt => opt.text === option);

        if (optionIndex === -1) {
            return res.status(400).json({ error: 'Invalid option' });
        }

        updatedOptions.options[optionIndex].votes += 1;

        await pool.query(
            'UPDATE polls SET options = $1, voted_ips = array_append(voted_ips, $2) WHERE id = $3',
            [JSON.stringify(updatedOptions), ipAddress, poll.id]
        );

        res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (error) {
        console.error('Voting error:', error);
        res.status(500).json({ error: 'Error recording vote' });
    }
});

// Get Poll (for both creator and voters)
app.get('/api/poll/:uniqueCode', async (req, res) => {
    const { uniqueCode } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    try {
        const pollResult = await pool.query(
            'SELECT * FROM polls WHERE unique_code = $1',
            [uniqueCode]
        );

        if (pollResult.rows.length === 0) {
            return res.status(404).json({ error: 'Poll not found' });
        }

        const poll = pollResult.rows[0];

        // If token is provided, check if the requester is the poll creator
        let isCreator = false;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                isCreator = decoded.userId === poll.user_id;
            } catch (error) {
                console.error('Token verification error:', error);
            }
        }

        // Prepare the response based on whether the requester is the creator or not
        const response = {
            question: poll.question,
            options: poll.options.options.map(opt => ({ text: opt.text, votes: isCreator ? opt.votes : undefined })),
            expiresAt: poll.expires_at,
            isExpired: new Date(poll.expires_at) < new Date(),
            isCreator
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Get poll error:', error);
        res.status(500).json({ error: 'Error fetching poll' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

console.log('Server initialized with all routes');