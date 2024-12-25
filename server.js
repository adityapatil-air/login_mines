const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

// In-memory user data store
let users = {};

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Route to get wallet balance
app.get('/wallet/:email', (req, res) => {
    const { email } = req.params;
    if (users[email]) {
        res.json({ wallet: users[email].wallet });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Route to update wallet balance
app.post('/wallet', (req, res) => {
    const { email, wallet } = req.body;
    if (!email || typeof wallet !== 'number') {
        return res.status(400).json({ message: 'Invalid data' });
    }
    users[email] = { wallet };
    res.json({ message: 'Wallet updated successfully', wallet });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
