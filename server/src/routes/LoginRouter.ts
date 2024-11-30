import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();

// Database connection
const pool = new Pool({
  host: process.env.PG_HOST || "aws-0-ap-southeast-1.pooler.supabase.com",
  port: parseInt(process.env.PG_PORT || "6543"),
  database: process.env.PG_DATABASE || "postgres",
  user: process.env.PG_USER || "postgres.oizvoxoctozusoahxjos",
  password: process.env.PG_PASSWORD || "Carmine_123456789!!!",
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'Carmine_1';

// Login route
router.post('/login', async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  try {
    // Check if user exists in DB
    const userQuery = await pool.query(`SELECT * FROM users WHERE user_name = $1`, [userName]);
    const user = userQuery.rows[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.user_password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, userName: user.user_name },
      JWT_SECRET,
      { expiresIn: '1h' }  // Expires in 1 hour
    );

    // Respond with token and user info
    res.json({
      message: "Login successful",
      token,
      userId: user.user_id,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
