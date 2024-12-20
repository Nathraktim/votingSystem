const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const authRoutes = require('./routes/authRoutes');
const pollRoutes = require('./routes/pollRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/polls', pollRoutes);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Dhruba jhora ${PORT}`));