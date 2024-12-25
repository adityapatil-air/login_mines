// Global variables
let minePositions = []; // Stores the positions of bombs
let walletAmount = 10000; // Default wallet amount
let betAmount = 0; // Player's current bet
let numberOfMines = 0; // Number of mines set by the player
let currentBetAmount = 0; // Tracks the reward for the current game

// Initialize the wallet on page load
async function initializeWallet() {
    const email = localStorage.getItem('currentUser');
    if (!email) {
        alert('You are not logged in.');
        window.location.href = 'index.html';
        return;
    }

    walletAmount = parseFloat(localStorage.getItem('wallet')) || 0;
    document.querySelector('.wallet-amount').textContent = `$${walletAmount.toFixed(2)}`;
}

// Function to start the game and set up mines
function startGame() {
    const cards = document.querySelectorAll('.card');
    const minesInput = document.getElementById('mines');
    const betInput = document.getElementById('bet-amount');

    // Validate wallet balance
    if (walletAmount <= 0) {
        alert('Your wallet is empty! You cannot place a bet.');
        return;
    }

    numberOfMines = parseInt(minesInput.value, 10);
    betAmount = parseFloat(betInput.value);

    // Validate inputs
    if (isNaN(numberOfMines) || numberOfMines <= 0 || numberOfMines >= cards.length) {
        alert('Please enter a valid number of mines (1-24).');
        return;
    }
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > walletAmount) {
        alert('Please enter a valid bet amount within your wallet balance.');
        return;
    }

    // Deduct bet amount and update wallet
    updateWallet(-betAmount);
    currentBetAmount = betAmount;
    document.querySelector('.current-bet-amount').textContent = `$${currentBetAmount.toFixed(2)}`;

    // Reset and set new mines
    resetGame();
    minePositions = generateMinePositions(cards.length, numberOfMines);

    console.log('Mine positions:', minePositions); // Debugging
}

// Function to update wallet balance locally and on the server
function updateWallet(amount) {
    walletAmount += amount;
    if (walletAmount < 0) walletAmount = 0;

    localStorage.setItem('wallet', walletAmount); // Update locally
    document.querySelector('.wallet-amount').textContent = `$${walletAmount.toFixed(2)}`;

    // Sync with the backend
    updateServerWallet();
}

// Update wallet balance on the server
async function updateServerWallet() {
    const email = localStorage.getItem('currentUser');
    try {
        await fetch('http://localhost:3000/wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, wallet: walletAmount }),
        });
        console.log('Wallet updated on the server.');
    } catch (error) {
        console.error('Error updating wallet:', error);
    }
}

// Initialize game on page load
window.onload = function () {
    if (localStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'index.html';
    } else {
        initializeWallet();
    }
};

// Sign-out functionality
function signOut() {
    localStorage.setItem('loggedIn', 'false');
    window.location.href = 'index.html';
}
