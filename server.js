const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

// In-memory user data store (you can replace this with a database like MongoDB, MySQL, etc.)
let users = [
  { userId: 'admin', password: 'admin123' }, // Example user
];

// Middleware setup
app.use(cors()); // Allow cross-origin requests from the frontend
app.use(bodyParser.json()); // To parse JSON bodies

// Login Route
app.post('/login', (req, res) => {
  const { userId, password } = req.body;

  // Check if the user exists
  const user = users.find(u => u.userId === userId && u.password === password);
  
  if (user) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Create Account Route
app.post('/create-account', (req, res) => {
  const { userId, password } = req.body;

  // Check if the user already exists
  const existingUser = users.find(u => u.userId === userId);

  if (existingUser) {
    return res.status(400).json({ message: 'User ID already exists' });
  }

  // Create a new user
  users.push({ userId, password });
  res.json({ message: 'Account created successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
