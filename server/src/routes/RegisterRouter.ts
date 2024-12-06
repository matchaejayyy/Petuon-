import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const pool = new Pool({
    host: process.env.PG_HOST || "aws-0-ap-southeast-1.pooler.supabase.com",
    port: parseInt(process.env.PG_PORT || "6543"),
    database: process.env.PG_DATABASE || "postgres",
    user: process.env.PG_USER || "postgres.oizvoxoctozusoahxjos",
    password: process.env.PG_PASSWORD || "Carmine_123456789!!!",
});

router.post('/register', async (req: Request, res: Response) => {
    const { email, userName, password } = req.body;
    try {
        // Validate input
        if (!email || !userName || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
        }

        // Check if email already exists
        const emailCheck = await pool.query(
            `SELECT * FROM users WHERE user_email = $1`,
            [email]
        );

        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new user into the database
        const result = await pool.query(
            `INSERT INTO users (user_email, user_name, user_password)
            VALUES ($1, $2, $3)
            RETURNING user_id, user_email, user_name`,
            [email, userName, hashedPassword]
        );

        // Return success response
        res.status(201).json({
            message: 'User registered successfully',
            user: result.rows[0],
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

export default router;
