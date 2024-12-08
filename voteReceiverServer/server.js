const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const voteRoutes = require('./routes/voteRoutes');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((err) => console.error('Error connecting to DB', err));
app.use('/api/vote', voteRoutes(pool));
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`VoteReceiverServer is running on port ${PORT}`);
});