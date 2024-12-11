import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { pool } from '../database/CarmineDB';

import authenticateToken  from '../middleware/AuthMiddleware'

dotenv.config(); // Ensure environment variables are loaded

const router = express.Router();

router.patch()