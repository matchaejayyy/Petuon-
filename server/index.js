require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');

const cors = require('cors')

const { Pool } = require('pg');

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT;

const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
});

 //>>>> declares server port running on 3002

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  }
)   

//>>>> FOR TO DO LIST

app.get('/getTask', async (req, res) => { 
  try {
      const result = await pool.query('SELECT * FROM tasks')
      res.status(200).send(result.rows);
  } catch (error) {
      console.error('Error fetching task:', error);
  }
});


app.post('/insertTask', async (req, res) => {
  try {
  const { text, createdAt, dueAt, completed } = req.body;

  const query = 'INSERT INTO tasks (text, created_at, due_at, completed) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [text, createdAt, dueAt, completed];

  pool.query(query, values)

  } catch (error) {
    console.error('Error inserting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  };
});

app.delete('/deleteTask/:task_id', async (req, res) => {
try {
  const { task_id } = req.params;
  pool.query('DELETE FROM tasks WHERE task_id = $1', [task_id]);
  res.send('Task deleted');
} catch (error) {
  console.error('Error deleting task:', error);
};
});

app.patch('/completeTask/:task_id', async (req, res) => {
  try {
    const {task_id} = req.params;
    const {completed} = req.body;

    const query = `
    UPDATE tasks 
    SET completed = $1
    WHERE task_id = $2
    RETURNING *;
    `

    const values = [completed, task_id];
    await pool.query(query, values);

  } catch (error) {
    console.error('Error updating task:', error)
  }

})

app.patch('/updateTask/:task_id', async (req, res) => {
  try {
    const { task_id } = req.params; 
    const { text, dueAt } = req.body; 

    const query = `
      UPDATE tasks 
      SET text = $1, due_at = $2 
      WHERE task_id = $3 
      RETURNING *;
    `;

    const values = [text, dueAt, task_id];
    
    await pool.query(query, values); 
  } catch (error) {
    console.error('Error updating task:', error);
  }
});


//>>>> FOR TO DO LIST



//>>>> FOR FLASH CARDS
// Get all decks
app.get("/decks", async (req, res) => {
  const result = await pool.query("SELECT * FROM decks");
  res.json(result.rows);
});

// Get flashcards for a deck
app.get("/decks/:deckId/flashcards", async (req, res) => {
  const { deckId } = req.params;
  const result = await pool.query("SELECT * FROM flashcards WHERE deck_id = $1", [deckId]);
  res.json(result.rows);
});

// Create a new deck
app.post("/decks", async (req, res) => {
  const { title } = req.body;
  const result = await pool.query("INSERT INTO decks (title) VALUES ($1) RETURNING *", [title]);
  res.json(result.rows[0]);
});

// Add a flashcard to a deck
app.post("/decks/:deckId/flashcards", async (req, res) => {
  const { deckId } = req.params;
  const { question, answer } = req.body;
  const result = await pool.query(
      "INSERT INTO flashcards (question, answer, deck_id) VALUES ($1, $2, $3) RETURNING *",
      [question, answer, deckId]
  );
  res.json(result.rows[0]);
});

// Delete a deck
app.delete("/decks/:deckId", async (req, res) => {
  const { deckId } = req.params;
  await pool.query("DELETE FROM decks WHERE id = $1", [deckId]);
  res.sendStatus(204);
});

// Delete a flashcard
app.delete("/flashcards/:flashcardId", async (req, res) => {
  const { flashcardId } = req.params;
  await pool.query("DELETE FROM flashcards WHERE id = $1", [flashcardId]);
  res.sendStatus(204);
});

app.put('/decks/:deckId/flashcards', async (req, res) => {
  const { deckId } = req.params;
  const { flashcards } = req.body;

  try {
      // Update flashcards for the specified deck in the database
      await pool.query('UPDATE decks SET flashcards = $1 WHERE id = $2', [JSON.stringify(flashcards), deckId]);
      res.status(200).send("Flashcards updated successfully");
  } catch (error) {
      console.error("Error updating flashcards:", error);
      res.status(500).send("Internal Server Error");
  }
});

//>>>> FOR FLASH CARDS
