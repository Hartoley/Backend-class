const express = require('express');
const app = express();
const dotenv = require("dotenv");
const port = 5000;
const cors = require('cors');

dotenv.config();

const connectDb = require('./config/db');
connectDb();

app.use(cors());
app.use(express.static('public'));

// Guard body parsers from consuming multipart streams
app.use((req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) return next()
    express.json()(req, res, next)
})

app.use((req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) return next()
    express.urlencoded({ extended: true })(req, res, next)
})

const userRoutes = require('./routes/user.routes');

app.get('/', (req, res) => {
    res.json({ message: "Welcome to our first API call" });
});

app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});