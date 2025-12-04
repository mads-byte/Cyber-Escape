import db from './db.js';
import mysql from 'mysql2/promise';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bcrypt from "bcrypt"
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.set('trust proxy', 1); // allows express to see the real client IP when behind a proxy in production (EC2 instance)
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));


app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        cookie: {
            httpOnly: true, // prevent client side from reading the cookie
            secure: process.env.NODE_ENV === 'production', // set true in production but frontend must be https
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // set to none in production but lax in development
            maxAge: 1000 * 60 * 60 * 2, // session expires after 2 hours
        },
    })
);


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
        if (teamAdmin.length == 0) { //check if team code exists
            return res
                .status(409)
                .json({ error: 'No existing teams with this code, try again!' });
        }

        const [existingTeammate] = await db.query(
            'SELECT id FROM users WHERE username = ? AND team_code = ?',
            [username, teamCode]
        );
        if (existingTeammate.length > 0) { // check if username already taken in this team
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

app.post('/user-login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }

        const [user] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (user.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const valid = await bcrypt.compare(password, user[0].password);

        if (!valid || user.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        req.session.admin = null;
        req.session.user = {
            id: user[0].id,
            account_type: 'user',
            username: user[0].username,
        };

        return res.json({ message: "Login successful", user: req.session.user });

    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/admin-login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }

        const [admin] = await db.query(
            'SELECT * FROM admins WHERE email = ?',
            [email]
        );

        if (admin.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const valid = await bcrypt.compare(password, admin[0].password);

        if (!valid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        req.session.user = null;
        req.session.admin = {
            id: admin[0].id,
            account_type: 'admin',
            username: admin[0].username,
        };

        return res.json({ message: "Login successful", admin: req.session.admin });

    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('api/earn-points', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { userId, points } = req.body;
        if (!userId || !points) {
            return res.status(400).json({ error: 'userId and points are required' });
        }

        const [result] = await db.query(
            'UPDATE users SET experience_points = exp_points + ? WHERE id = ?',
            [points, userId]
        );

        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: `+${points} xp` });
    } catch (error) {
        console.error('Error updating experience points:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/me', async (req, res) => {
    try {
        if (req.session.user) {
            const [user] = await db.query(
                'SELECT * FROM users WHERE id = ?',
                [req.session.user.id]
            )
            return res.json({ user: user[0].username, email: user[0].email, team_code: user[0].team_code, exp_points: user[0].exp_points });
        } else if (req.session.admin) {
            const [admin] = await db.query(
                'SELECT * FROM admins WHERE id = ?',
                [req.session.admin.id]
            )
            const [teamMembers] = await db.query(
                'SELECT id, username, email, exp_points FROM users WHERE team_code = ?',
                [admin[0].team_code]
            )
            return res.json({ admin: admin[0].username, email: admin[0].email, team_code: admin[0].team_code, team_members: teamMembers });
        }
    } catch (err) {
        console.error('Error fetching user/admin data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.clearCookie('connect.sid');
        console.log('Logout successful');
        res.json({ message: 'Logout successful' });
    });
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});



