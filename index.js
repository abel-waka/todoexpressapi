import express from 'express';
import crypto from 'crypto';
import fs from 'fs/promises';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

//____________________________________________________________________________
// FILE:
const tasksFile = './tasks.json';

const readTasksFromFile = async () => {
  try {
    const data = await fs.readFile(tasksFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return []; // Si ocurre un error, devolvemos un array vacío
  }
}

const writeTasksToFile = async (tasks) => {
  await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2));
};
//____________________________________________________________________________


//__________________________________________________________________________
// CREATE: Crear una nueva tarea
app.post('/new-task', async (req, res) => {
  const { text } = req.body;
  const tasks = await readTasksFromFile();
  const newTask = { id: crypto.randomUUID(), text, isDone: false };
  tasks.push(newTask);
  await writeTasksToFile(tasks);
  res.status(201).json(newTask);
});

//__________________________________________________________________________
// READ: Obtener todas las tareas
app.get('/tasks', async (req, res) => {
  const tasks = await readTasksFromFile();
  res.json(tasks);
});
//__________________________________________________________________________
// READ: Obtener una tarea por ID
app.get('/task/:id', async (req, res) => {
  const tasks = await readTasksFromFile();
  const task = tasks.find(t => t.id == req.params.id);
  if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
  res.json(task);
});

//__________________________________________________________________________
// UPDATE: Actualizar una tarea por ID
app.put('/task/:id', async (req, res) => {
  const tasks = await readTasksFromFile();
  const taskIndex = tasks.findIndex(t => t.id == req.params.id);
  if (taskIndex === -1) return res.status(404).json({ message: 'Tarea no encontrada' });

  const { text, isDone } = req.body;
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    text: text || tasks[taskIndex].text,
    isDone: isDone !== undefined ? isDone : tasks[taskIndex].isDone,
  };

  await writeTasksToFile(tasks);
  res.json(tasks[taskIndex]);
});

//__________________________________________________________________________
// DELETE: Eliminar una tarea por ID
app.delete('/task/:id', async (req, res) => {
  let tasks = await readTasksFromFile();
  tasks = tasks.filter(t => t.id != req.params.id);
  await writeTasksToFile(tasks);
  res.status(204).send();
});

//__________________________________________________________________________

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
