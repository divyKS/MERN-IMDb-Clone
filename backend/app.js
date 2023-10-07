const express = require('express');
const app = express();
require('./db');
require('express-async-errors');
require('dotenv').config();
app.use(express.json());
const userRouter = require('./routes/user');
const { errorHandler } = require('./middlewares/error');
const cors = require('cors')

app.use(cors())

app.use('/api/user', userRouter);

app.use('/*', (req, res)=>{
    const reqSentTo = req.protocol + '://' + req.get('host') + req.baseUrl;
    res.status(404).json({"error": "You made a request to " + reqSentTo + ". This route does not exist."})
})

app.use(errorHandler);

app.listen(3000, ()=>{console.log("Backend server running on port 3000")});