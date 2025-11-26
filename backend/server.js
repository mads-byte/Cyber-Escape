import db from './db.js';
import mysql from 'mysql2/promise';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bcrypt from "bcrypt"
import dotenv from 'dotenv';
dotenv.config();




const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

// To generate random team codes
function generateCode() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 5; i++) {
        code += letters[Math.floor(Math.random() * letters.length)];
    }
    return code;
}


app.post('/register-user', async (req, res) => {
    try {
        const { username, email, password, teamCode } = req.body;
        if (!username || !email || !password || !teamCode) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const [existingEmail] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        if (existingEmail.length > 0) {
            return res
                .status(409)
                .json({ error: 'Email already registered, please sign in!' });
        }


        const [teamAdmin] = await db.query(
            'SELECT id FROM admins WHERE team_code = ?',
            [teamCode]
        );
        if (teamAdmin.length == 0) {
            return res
                .status(409)
                .json({ error: 'No existing teams with this code, try again!' });
        }

        const [existingTeammate] = await db.query(
            'SELECT id FROM users WHERE username = ? AND team_code = ?',
            [username, teamCode]
        );
        if (existingTeammate.length > 0) {
            return res
                .status(409)
                .json({ error: 'One of your teammates already has this username!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users (username, email, password, team_code)
             VALUES (?, ?, ?, ?)`,
            [username, email, hashedPassword, teamCode]
        );
        res.status(201).json({ message: 'User registered successfully', teamCode });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/register-admin', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'username, email, and password are required' });
        }
        const [existingEmail] = await db.query(
            'SELECT id FROM admins WHERE email = ?',
            [email]
        );
        if (existingEmail.length > 0) {
            return res
                .status(409)
                .json({ error: 'Email already registered, please sign in!' });
        }

        let team_code = generateCode();
        let [existingCode] = await db.query(
            'SELECT id FROM admins WHERE team_code = ?',
            [team_code]
        );

        while (existingCode.length > 0) {
            team_code = generateCode();
            [existingCode] = await db.query(
                'SELECT id FROM admins WHERE team_code = ?',
                [team_code]
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO admins (username, email, password, team_code)
             VALUES (?, ?, ?, ?)`,
            [username, email, hashedPassword, team_code]
        );
        res.status(201).json({ message: 'Admin registered successfully', team_code });
    } catch (error) {
        console.error('Error during admin registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/user-login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'username and password are required' });
        }

        const [user] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (user.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const valid = await bcrypt.compare(password, user[0].password);

        if (!valid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Login successful', user: user[0] });

    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/admin-login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'username and password are required' });
        }

        const [admin] = await db.query(
            'SELECT * FROM admins WHERE username = ?',
            [username]
        );

        if (admin.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const valid = await bcrypt.compare(password, admin[0].password);

        if (!valid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Login successful', admin: admin[0] });

    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});




