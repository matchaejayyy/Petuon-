import { Request, Response } from 'express';
import { pool, router } from '../database/CarmineDB'
import bcrypt from 'bcrypt';

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
