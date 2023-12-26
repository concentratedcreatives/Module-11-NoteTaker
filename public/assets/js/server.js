const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
const sendFile = (res, fileName) =>
  res.sendFile(path.join(__dirname, `../../${fileName}.html`));

app.get('/notes', (req, res) => sendFile(res, 'notes'));
app.get('*', (req, res) => sendFile(res, 'index'));

// API Routes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const { body } = req;
  const notes = JSON.parse(fs.readFileSync('db/db.json', 'utf8'));

  body.id = generateUniqueId();
  notes.push(body);

  fs.writeFileSync('db/db.json', JSON.stringify(notes));
  res.json(body);
});

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));
