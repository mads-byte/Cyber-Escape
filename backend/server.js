import db from './db.js';
import mysql from 'mysql2/promise';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();




const app = express();
const PORT = 3000;


app.use(express.json());
app.use(cors());

app.post('/login', async (req, res) => {
    try {
        const { username, email } = req.body;
        if (!username || !email) {
            return res.status(400).json({ error: 'username and email are required' });
        }
        const [user] = await db.query(
            'SELECT * FROM users WHERE username = ? AND email = ?',
            [username, email]
        );
        if (user.length > 0) {
            res.status(200).json({ message: 'Login successful', user: user[0] });
        } else {
            res.status(401).json({ error: 'Invalid username or email' });
        }

        console.log(user);
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});



