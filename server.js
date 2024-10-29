const express = require('express');
const fs = require('fs-extra');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Data storage file
const DATA_FILE = './data.json';

// Helper: Read data from file
const readData = async () => {
  try {
    const data = await fs.readJSON(DATA_FILE);
    return data;
  } catch {
    return [];
  }
};

// Helper: Write data to file
const writeData = async (data) => {
  await fs.writeJSON(DATA_FILE, data, { spaces: 2 });
};

// CRUD routes
app.get('/items', async (req, res) => {
  const data = await readData();
  res.json(data);
});

app.post('/items', async (req, res) => {
  const newItem = req.body;
  const data = await readData();
  newItem.id = Date.now(); // Generate a unique ID
  data.push(newItem);
  await writeData(data);
  res.status(201).json(newItem);
});

app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  const data = await readData();
  const index = data.findIndex((item) => item.id == id);
  if (index === -1) return res.status(404).json({ error: 'Item not found' });
  data[index] = { ...data[index], ...updatedItem };
  await writeData(data);
  res.json(data[index]);
});

app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readData();
  const newData = data.filter((item) => item.id != id);
  await writeData(newData);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
