import { Request, Response } from 'express';
import { pool, router } from '../database/CarmineDB'
import bcrypt from 'bcrypt';
import { ValidateRegister } from '../middleware/RegisterMiddleware';


router.post('/registerUser',  async (req: Request, res: Response) => {
    const { user_password, user_id, user_email, user_name } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user_password, saltRounds);

    try {
      // Insert data into the database
      const query = `
      INSERT INTO users (user_id, user_email, user_name, user_password)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id, user_email, user_name
    `;
    const values = [user_id, user_email, user_name, hashedPassword];

    await pool.query(query, values);
      res.status(201).send('User data added successfully');
    } catch (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Server error');
    }
  });
  
router.get('/getUser', async (req: Request, res: Response) => {
    console.log('Request body:', req.body); // Log the request body for debugging

    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows)
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Database error' });
    }
});


export default router;
