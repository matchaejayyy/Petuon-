import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import ToDoListRouter from "./routes/ToDoListRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Routes
app.use('/tasks', ToDoListRouter);


 // Start Server on port 3002

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  }
)   

//>>>> FOR TO DO LIST

// app.get('/getTask', async (req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: any): void; new(): any; }; }; }) => { 
//   try {
//       const result = await pool.query('SELECT * FROM tasks')
//       res.status(200).send(result.rows);
//   } catch (error) {
//       console.error('Error fetching task:', error);
//   }
// });


// app.post('/insertTask', async (req: { body: { task_id: any; text: any; createdAt: any; dueAt: any; completed: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) => {
//   try {
//   const {task_id, text, createdAt, dueAt, completed } = req.body;

//   const query = 'INSERT INTO tasks (task_id, text, created_at, due_at, completed) VALUES ($1, $2, $3, $4, $5) RETURNING *';
//   const values = [task_id, text, createdAt, dueAt, completed];

//   pool.query(query, values)

//   } catch (error) {
//     console.error('Error inserting task:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   };
// });

// app.delete('/deleteTask/:task_id', async (req: { params: { task_id: any; }; }, res: { send: (arg0: string) => void; }) => {
// try {
//   const { task_id } = req.params;
//   pool.query('DELETE FROM tasks WHERE task_id = $1', [task_id]);
//   res.send('Task deleted');
// } catch (error) {
//   console.error('Error deleting task:', error);
// };
// });

// app.patch('/completeTask/:task_id', async (req: { params: { task_id: any; }; body: { completed: any; }; }, res: any) => {
//   try {
//     const {task_id} = req.params;
//     const {completed} = req.body;

//     const query = `
//     UPDATE tasks 
//     SET completed = $1
//     WHERE task_id = $2
//     RETURNING *;
//     `

//     const values = [completed, task_id];
//     await pool.query(query, values);

//   } catch (error) {
//     console.error('Error updating task:', error)
//   }

// })

// app.patch('/updateTask/:task_id', async (req: { params: { task_id: any; }; body: { text: any; dueAt: any; }; }, res: any) => {
//   try {
//     const { task_id } = req.params; 
//     const { text, dueAt } = req.body; 

//     const query = `
//       UPDATE tasks 
//       SET text = $1, due_at = $2 
//       WHERE task_id = $3 
//       RETURNING *;
//     `;

//     const values = [text, dueAt, task_id];
    
//     await pool.query(query, values); 
//   } catch (error) {
//     console.error('Error updating task:', error);
//   }
// });

// //>>>> FOR TO DO LIST

