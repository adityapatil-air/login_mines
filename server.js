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

















// To achieve the synchronization of wallet amounts across different browsers and machines, you need a central storage system where the wallet amount is stored and retrieved every time the user logs in. Using a database like MongoDB or MySQL would be a good approach. Both databases have their pros and cons:

// MongoDB:

// Pros: Schema-less, flexible document-based storage, easy to scale horizontally.
// Cons: Less efficient for complex queries that require joins, eventual consistency.
// MySQL:

// Pros: Relational database with strong consistency, efficient for complex queries with joins.
// Cons: Fixed schema, less flexible for unstructured data, harder to scale horizontally.
// Given the nature of the wallet amount, which is a simple key-value pair associated with a user, both MongoDB and MySQL can handle this use case effectively. However, MongoDB's flexibility and ease of use with JSON-like documents might make it a bit simpler to implement for a beginner.

// Here is a high-level plan to implement this:

// Set up a database:

// Choose either MongoDB or MySQL and set up a database instance.
// Create an API:

// Create RESTful API endpoints for updating and retrieving the wallet amount.
// Use Node.js with Express.js to create these endpoints.
// Modify the client-side code:

// Update the initializeWallet and updateServerWallet functions to interact with the API.
// Example Implementation with MongoDB:

// Set up MongoDB:

// Use MongoDB Atlas or a local MongoDB instance.
// Create a database and a collection named users.
// Create API endpoints:

// JavaScript
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');

// const app = express();
// app.use(bodyParser.json());

// mongoose.connect('mongodb://localhost:27017/wallet', { useNewUrlParser: true, useUnifiedTopology: true });

// const userSchema = new mongoose.Schema({
//     email: String,
//     walletAmount: Number
// });

// const User = mongoose.model('User', userSchema);

// app.post('/wallet', async (req, res) => {
//     const { email, walletAmount } = req.body;
//     try {
//         await User.findOneAndUpdate({ email }, { walletAmount }, { upsert: true });
//         res.status(200).send('Wallet updated successfully');
//     } catch (error) {
//         res.status(500).send('Error updating wallet');
//     }
// });

// app.get('/wallet', async (req, res) => {
//     const { email } = req.query;
//     try {
//         const user = await User.findOne({ email });
//         if (user) {
//             res.status(200).json({ walletAmount: user.walletAmount });
//         } else {
//             res.status(200).json({ walletAmount: 10000 }); // Default amount for new users
//         }
//     } catch (error) {
//         res.status(500).send('Error retrieving wallet');
//     }
// });

// app.listen(3000, () => {
//     console.log('Server running on port 3000');
// });
// Public code references from 1 repository
// 2 vulnerabilities detected
// Modify client-side code:
// JavaScript
// async function initializeWallet() {
//     const email = localStorage.getItem('currentUser');
//     if (!email) {
//         alert('You are not logged in.');
//         window.location.href = 'index.html';
//         return;
//     }

//     try {
//         const response = await fetch(`http://localhost:3000/wallet?email=${email}`);
//         const data = await response.json();
//         walletAmount = data.walletAmount;
//         localStorage.setItem(`wallet_${email}`, walletAmount);
//     } catch (error) {
//         console.error('Error retrieving wallet:', error);
//         walletAmount = 10000; // Fallback to default amount
//     }

//     document.querySelector('.wallet-amount').textContent = `$${walletAmount.toFixed(2)}`;
//     console.log(`Wallet initialized: $${walletAmount}`);
// }

// async function updateServerWallet() {
//     const email = localStorage.getItem('currentUser');
//     try {
//         await fetch('http://localhost:3000/wallet', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, wallet: walletAmount }),
//         });
//     } catch (error) {
//         console.error('Error updating wallet:', error);
//     }
// }
// This implementation ensures that the wallet amount is always retrieved from and updated on the server, making it consistent across different browsers and machines.


