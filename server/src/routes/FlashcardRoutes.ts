import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { pool } from '../database/CarmineDB';

dotenv.config(); // Ensure environment variables are loaded

const router = express.Router();

// Get all decks
router.get('/getDecks', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM decks');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).send('Internal Server Error');
  }
});

//get all flashcards
router.get('/getFlashcards', async (req: Request, res: Response) => {
  try {
      const result = await pool.query('SELECT * FROM flashcards');
      res.status(200).json(result.rows);
  } catch (error) {
      console.error('Error fetching flashcards:', error);
      res.status(500).send('Internal Server Error');
  }
});


// Add a deck
router.post('/insertDecks', async (req: Request, res: Response) => {
  const { deck_id, title } = req.body;

  try {
    const query = 'INSERT INTO decks (deck_id, title) VALUES ($1, $2) RETURNING *';
    const values = [deck_id, title];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]); // Return the new deck
  } catch (error) {
    console.error('Error adding deck:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Add a flashcard to a deck
router.post('/insertCard', async (req: Request, res: Response) => {
  const { question, answer, flashcard_id } = req.body;
  console.log(req.body)

  if (!question || !answer || !flashcard_id) {
    return res.status(400).send('Question, answer, and deck_id are required');
  }

  try {
    const query = 'INSERT INTO flashcards (question, answer, flashcard_id) VALUES ($1, $2, $3) RETURNING *';
    const values = [question, answer, flashcard_id];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting flashcard:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Delete a deck
router.delete('/deleteDeck', async (req: Request, res: Response) => {
  const { deckId } = req.params;

  try {
    await pool.query('DELETE FROM decks WHERE id = $1', [deckId]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting deck:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a flashcard
router.delete('/flashcards/:flashcardId', async (req: Request, res: Response) => {
  const { flashcardId } = req.params;

  try {
    await pool.query('DELETE FROM flashcards WHERE id = $1', [flashcardId]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).send('Internal Server Error');
  }
});


export default router;
