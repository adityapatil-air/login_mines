const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

// In-memory user data store (you can replace this with a database like MongoDB, MySQL, etc.)
let users = {}; // Example: { "user@example.com": { wallet: 10000 } }

// Middleware setup
app.use(cors());
app.use(bodyParser.json()); // To parse JSON request bodies

// Route to get wallet balance for a user
app.get('/wallet/:email', (req, res) => {
    const { email } = req.params;

    // Check if the user exists
    if (users[email]) {
        res.json({ wallet: users[email].wallet });
    } else {
        // If user does not exist, return 404
        res.status(404).json({ message: 'User not found' });
    }
});

// Route to update or create a wallet for a user
app.post('/wallet', (req, res) => {
    const { email, wallet } = req.body;

    // Validate request
    if (!email || typeof wallet !== 'number') {
        return res.status(400).json({ message: 'Invalid data' });
    }

    // If the user does not exist, create a new one with the provided wallet amount
    if (!users[email]) {
        users[email] = { wallet: 10000 }; // Default balance for new users
    }

    // Update the user's wallet balance
    users[email].wallet = wallet;

    res.json({ message: 'Wallet updated successfully', wallet });
});

// Route to reset the server (for development/testing purposes)
app.post('/reset', (req, res) => {
    users = {}; // Clear all user data
    res.json({ message: 'Server reset successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
