import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


try {
    await connection.query('SELECT 1');
    console.log('Database connected successfully!');
} catch (err) {
    console.error('Database connection failed:', err.message);
}

export default connection;