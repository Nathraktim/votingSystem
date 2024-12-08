const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

// PostgreSQL config
const config = {
    user: "avnadmin",
    password: process.env.DB_PASSWORD,
    host: "voting-system-votingsystem.i.aivencloud.com",
    port: 11777,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('./ca.pem').toString(),
    },
};

const pool = new Pool(config);

// Middleware setup
const corsOptions = {
    origin: process.env.CLIENT_DOMAIN || 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Utility function to generate unique codes
function generateUniqueCode() {
    return uuidv4().substr(0, 8);
}

// Database connection test
pool.connect((err, client, release) => {
    if (err) {
        console.error("Error acquiring client:", err);
        return;
    }

    client.query("SELECT VERSION()", [], (err, result) => {
        release();
        if (err) {
            console.error("Query error:", err.stack);
        } else {
            console.log("PostgreSQL Version:", result.rows[0].version);
        }
    });
});

// Routes
app.get('/', (req, res) => {
    res.status(200).send('Voting system server is running!');
});

// Signup route
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

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.status(200).json({ token, email: user.email });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error logging in' });
    }
});


// Poll creation route
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

// Voting route
app.post('/api/vote/:uniqueCode', async (req, res) => {
    const { uniqueCode } = req.params;
    const { option } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
        const pollResult = await pool.query(
            'SELECT * FROM polls WHERE unique_code = $1 AND expires_at > NOW()',
            [uniqueCode]
        );
        if (pollResult.rows.length === 0) {
            return res.status(404).json({ error: 'Poll not found or has expired' });
        }

        const poll = pollResult.rows[0];
        if (poll.voted_ips.includes(ipAddress)) {
            return res.status(400).json({ error: 'You have already voted on this poll' });
        }

        const updatedOptions = poll.options;
        const optionIndex = updatedOptions.options.findIndex(opt => opt.text === option);
        if (optionIndex === -1) {
            return res.status(400).json({ error: 'Invalid option' });
        }
        updatedOptions.options[optionIndex].votes += 1;

        // Update the poll in the database
        await pool.query(
            'UPDATE polls SET options = $1, voted_ips = array_append(voted_ips, $2) WHERE id = $3',
            [JSON.stringify(updatedOptions), ipAddress, poll.id]
        );

        // Emit real-time update to all connected clients
        io.to(uniqueCode).emit('pollUpdate', {
            question: poll.question,
            options: updatedOptions.options,
            expiresAt: poll.expires_at,
            isExpired: new Date(poll.expires_at) < new Date(),
        });

        res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (error) {
        console.error('Voting error:', error);
        res.status(500).json({ error: 'Error recording vote' });
    }
});

// Fetch poll details route
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
        let isCreator = false;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                isCreator = decoded.userId === poll.user_id;
            } catch (error) {
                console.error('Token verification error:', error);
            }
        }

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

// WebSocket setup for real-time updates
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('joinPoll', (uniqueCode) => {
        socket.join(uniqueCode);
        console.log(`User joined poll: ${uniqueCode}`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});