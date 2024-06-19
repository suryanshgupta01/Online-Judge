const express = require('express');
const app = express();
require("dotenv").config()
const bodyParser = require('body-parser');
const connectDB = require('./database/ConnectDB');
const userRoutes = require('./routes/userRoutes');
const problemRoutes = require('./routes/problemRoutes')
const submissionRoutes = require('./routes/submissionRoutes')
const contestRoutes = require('./routes/contestRoutes')
const PORT = process.env.PORT || 4000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json())


app.use('/user', userRoutes);
app.use('/contest', contestRoutes)
app.use('/problem', problemRoutes);
app.use('/submission', submissionRoutes);


app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});

connectDB();