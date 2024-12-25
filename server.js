const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

// In-memory user data store (replace with a database in production)
let users = {}; // Example: { "user@example.com": { wallet: 10000 } }

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

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

// Route to create or update wallet balance
app.post('/wallet', (req, res) => {
    const { email, wallet } = req.body;

    // Validate request
    if (!email || typeof wallet !== 'number') {
        return res.status(400).json({ message: 'Invalid data' });
    }

    // If user does not exist, initialize them with $10,000
    if (!users[email]) {
        users[email] = { wallet: 10000 }; // Default wallet
    }

    // Update user's wallet balance
    users[email].wallet = wallet;

    res.json({ message: 'Wallet updated successfully', wallet: users[email].wallet });
});

// Route to reset server data (Optional for testing)
app.post('/reset', (req, res) => {
    users = {}; // Clear all user data
    res.json({ message: 'Server reset successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
