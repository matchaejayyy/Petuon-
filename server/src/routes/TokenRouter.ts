import { Request, Response } from 'express';
import { pool, router } from '../database/CarmineDB';

router.get('/:user_id', async (req: Request, res: Response): Promise<Response> => {
  const { user_id } = req.params;
  console.log(`Received request to fetch token for user_id: ${user_id}`); // Log the incoming request

  try {
    const result = await pool.query(
      `SELECT user_id, token FROM users WHERE user_id = $1`,
      [user_id]
    );

    if (result.rows.length === 0 || result.rows[0].token === null) {
      console.log(`No valid token found for user_id: ${user_id}`); // Log if no valid token is found
      return res.status(404).json({ message: "No valid token for this user." });
    }

    const { user_id: dbUserId, token } = result.rows[0];
    console.log(`Successfully retrieved token for user_id: ${dbUserId}`); // Log successful token retrieval
    return res.status(200).json({ user_id: dbUserId, token });

  } catch (error: unknown) {
    console.error("Error retrieving token:", error); // Log the error
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.post('/logout/:user_id', async (req: Request, res: Response): Promise<Response> => {
  const { user_id } = req.params;
  console.log(`Received request to logout user_id: ${user_id}`); // Log the incoming request

  try {
    const result = await pool.query(
      `DELETE FROM users WHERE user_id = $1 RETURNING user_id`,
      [user_id]
    );

    console.log(result.rows);
    if (result.rows.length === 0) {
      console.log(`User  not found for user_id: ${user_id}`); // Log if the user is not found
      return res.status(404).json({ message: "User  not found." });
    }

    console.log(`Successfully logged out and deleted user_id: ${user_id}`); // Log successful logout
    return res.status(200).json({ message: "Logged out and user deleted successfully." });

  } catch (error: unknown) {
    console.error("Error during logout:", error); // Log the error
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
