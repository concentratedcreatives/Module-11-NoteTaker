const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }), express.json(), express.static('public'));

const sendFile = (res, fileName) => res.sendFile(path.join(__dirname, `../../${fileName}.html`));

const handleApiError = (res, error) => (console.error('Error reading or parsing db.json:', error), res.status(500).send('Internal Server Error'));

app.get('/notes', (req, res) => sendFile(res, 'notes'));
app.get('*', (req, res) => sendFile(res, 'index'));

app.get('/api/notes', (req, res) => {
  try { res.json(JSON.parse(fs.readFileSync('db/db.json', 'utf8')) || []); } 
  catch (error) { handleApiError(res, error); }
});

app.post('/api/notes', (req, res) => {
  try {
    const { body } = req;
    const notes = [...JSON.parse(fs.readFileSync('db/db.json', 'utf8')), { ...body, id: Math.random().toString(36).substr(2, 9) }];
    fs.writeFileSync('db/db.json', JSON.stringify(notes));
    res.json(body);
  } catch (error) { handleApiError(res, error); }
});

app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));
