const express = require('express');
const app = express();
require("dotenv").config()
const bodyParser = require('body-parser');
const connectDB = require('./database/ConnectDB');
const submissionRoutes = require('./routes/submissionRoutes')
const PORT = process.env.SUBMISSION_PORT || 4500;
const cors = require('cors');
const Contest = require('./models/contestModel');
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Submission Server is running');
});

app.use('/submission', submissionRoutes);

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});

connectDB();