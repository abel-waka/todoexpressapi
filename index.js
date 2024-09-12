import express from 'express';
const app = express();

// Simulamos una base de datos en memoria
let tasks = [];

//__________________________________________________________________________
// CREATE: Crear una nueva tarea
app.post('/create-task', (req, res) => {
  const { text } = req.body;
  const newTask = { id: new Date(), text, isDone: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

//__________________________________________________________________________
// READ: Obtener todas las tareas
app.get('/get-tasks', (req, res) => {
  res.json(tasks);
});
//__________________________________________________________________________
// READ: Obtener una tarea por ID
app.get('/task/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
  res.json(task);
});

//__________________________________________________________________________
// UPDATE: Actualizar una tarea por ID
app.put('/task/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });

  const { text, isDone } = req.body;
  task.text = text || task.text;
  task.isDone = isDone || task.isDone;
  res.json(task);
});

//__________________________________________________________________________
// DELETE: Eliminar una tarea por ID
app.delete('/task/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  res.status(204).send();
});

//__________________________________________________________________________

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
