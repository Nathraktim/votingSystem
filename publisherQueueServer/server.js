const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const queueRoutes = require('./routes/queueRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/queue', queueRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Publisher Queue Server running on port ${PORT}`));