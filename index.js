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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/user.routes');

// Fixed: merged both GET "/" handlers, fixed loop condition
app.get('/', (req, res) => {
    const loop = () => {
        let count = 10;
        for (let i = 6; i < count; i++) {  // ✅ was "i > count" — never ran
            console.log(i);
        }
    };

    loop();
    console.log(`Received ${req.method} request for ${req.url}`);
    res.json({ message: "Welcome to our first API call" });
});

app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});