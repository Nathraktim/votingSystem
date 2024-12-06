const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const voteRoutes = require('./routes/voteRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/votes', voteRoutes);

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Vote Receiver Server running on port ${PORT}`));
