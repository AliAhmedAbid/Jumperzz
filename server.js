const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Path to users.json file
const USERS_FILE = './users.json';

// Ensure users.json exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Get all users
app.get('/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  res.json(users);
});


app.post('/signup', (req, res) => {
  const { name, aftername, gmail, password } = req.body;

  if (!name || !aftername || !gmail || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE));

  
  const exists = users.some(user => user.gmail === gmail);
  if (exists) {
    return res.status(400).json({ error: 'Gmail already registered' });
  }

  users.push({ name, aftername, gmail, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ message: 'User registered successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
