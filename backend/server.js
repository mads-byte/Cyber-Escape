import db from './db.js';
import mysql from 'mysql2/promise';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bcrypt from "bcrypt"
import dotenv from 'dotenv';
dotenv.config();
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import { RedisStore } from "connect-redis"



const app = express();
app.set('trust proxy', true); // allows express to see the real client IP when behind a proxy in production (EC2 instance)
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

const redisClient = new Redis({ //host Redis
    host: process.env.NODE_ENV === 'production' ? process.env.REDIS_HOST : '127.0.0.1', // check if in production to use AWS Redis or local Redis
    port: 6379,
    // tls: {} // TLS required for AWS ElastiCache Redis
});

redisClient.on('connect', () => console.log('Connected to Redis!'));
redisClient.on('error', (err) => console.error('Redis connection error:', err));



const loginLimiter = new RateLimiterRedis({ // use redis to store login attempts and limit them
    storeClient: redisClient,
    keyPrefix: 'login',
    points: 10,          // 10 attempts
    duration: 15 * 60,  // per 15 minutes
    blockDuration: 15 * 60, // block for 15 minutes if exceeded  
});



app.use(
    session({
        store: new RedisStore({ client: redisClient }), // use redis to store sessions instead of memory
        secret: process.env.SESSION_SECRET,
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
        cookie: {
            httpOnly: true, // prevent client side from reading the cookie
            secure: process.env.NODE_ENV === 'production', // set true in production but frontend must be https
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 1000 * 60 * 60 * 2, // expires after 2 hours
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
        await loginLimiter.consume(req.ip);
        next();
    } catch (err) {
        return res.status(429).json({
            error: "Too many login attempts. Please wait 15 minutes."
        });
    }
}, async (req, res) => {
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

        if (!valid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Login successful → reset limiter for this IP
        await loginLimiter.delete(req.ip);

        req.session.admin = null;
        req.session.user = {
            id: user[0].id,
            account_type: 'user',
            username: user[0].username,
            email: user[0].email,
            experience_points: user[0].experience_points,
            team_code: user[0].team_code
        };

        return res.json({ message: "Login successful", user: req.session.user });

    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/admin-login', async (req, res, next) => {
    try {
        await loginLimiter.consume(req.ip);
        next();
    } catch {
        return res.status(429).json({
            error: "Too many login attempts. Try again later."
        });
    }
}, async (req, res) => {
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

        await loginLimiter.delete(req.ip);

        req.session.user = null;
        req.session.admin = {
            id: admin[0].id,
            account_type: 'admin',
            username: admin[0].username,
            email: admin[0].email,
            team_code: admin[0].team_code
        };

        return res.json({ message: "Login successful", admin: req.session.admin });

    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});




