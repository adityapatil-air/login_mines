// Global variables
let minePositions = []; // Stores the positions of bombs
let walletAmount = 10000; // Default wallet amount
let betAmount = 0; // Player's current bet
let numberOfMines = 0; // Number of mines set by the player
let currentBetAmount = 0; // Tracks the reward for the current game

// Function to initialize the wallet on page load
async function initializeWallet() {
    const email = localStorage.getItem('currentUser');
    if (!email) {
        alert('You are not logged in.');
        window.location.href = 'index.html';
        return;
    }

    // Load wallet amount from localStorage
    let storedWalletAmount = localStorage.getItem('wallet');
    if (storedWalletAmount === null) {
        // Set default wallet amount for new users
        walletAmount = 10000;
        localStorage.setItem('wallet', walletAmount);
    } else {
        walletAmount = parseFloat(storedWalletAmount);
    }

    document.querySelector('.wallet-amount').textContent = `$${walletAmount.toFixed(2)}`;
    console.log(`Wallet initialized: $${walletAmount}`);
}

// Function to start the game and set up mines
function startGame() {
    const cards = document.querySelectorAll('.card');
    const minesInput = document.getElementById('mines');
    const betInput = document.getElementById('bet-amount');

    // Validate wallet balance
    if (walletAmount <= 0) {
        alert('Your wallet is empty! You cannot place a bet.');
        console.log('StartGame: Wallet balance is insufficient.');
        return;
    }

    numberOfMines = parseInt(minesInput.value, 10);
    betAmount = parseFloat(betInput.value);

    // Validate inputs
    if (isNaN(numberOfMines) || numberOfMines <= 0 || numberOfMines >= cards.length) {
        alert('Please enter a valid number of mines (1-24).');
        console.log('StartGame: Invalid number of mines entered.');
        return;
    }
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > walletAmount) {
        alert('Please enter a valid bet amount within your wallet balance.');
        console.log('StartGame: Invalid bet amount entered.');
        return;
    }

    // Deduct bet amount and update wallet
    updateWallet(-betAmount);
    currentBetAmount = betAmount;
    document.querySelector('.current-bet-amount').textContent = `$${currentBetAmount.toFixed(2)}`;

    // Reset and set new mines
    resetGame();
    minePositions = generateMinePositions(cards.length, numberOfMines);
    console.log('Mine positions:', minePositions);
}

// Function to handle clicking on a card
function changeColor(card) {
    if (card.classList.contains('clicked')) {
        console.log('ChangeColor: Card already clicked.');
        return; // Prevent re-clicking on the same card
    }

    const cards = Array.from(document.querySelectorAll('.card'));
    const cardIndex = cards.indexOf(card);
    const isMine = minePositions.includes(cardIndex);

    if (isMine) {
        card.style.backgroundColor = 'red'; // Bomb color
        card.classList.add('clicked');
        revealAllCards();
        setTimeout(() => {
            alert('BOOM! You hit a mine! Game over.');
            resetGame();
        }, 100);
        console.log('ChangeColor: Mine clicked. Game over.');
    } else {
        card.style.backgroundColor = 'green'; // Safe card color
        card.classList.add('clicked');
        const reward = calculateReward();
        currentBetAmount = reward; // Update the current bet amount
        document.querySelector('.current-bet-amount').textContent = `$${currentBetAmount.toFixed(2)}`;
        console.log('ChangeColor: Safe card clicked. Current reward:', currentBetAmount);

        // Increase the wallet amount when a green card is revealed
        updateWallet(reward);
    }
}

// Function to calculate reward based on remaining safe cards
function calculateReward() {
    const totalCards = 25;
    const greenCards = totalCards - numberOfMines;
    const revealedCards = document.querySelectorAll('.card.clicked').length;
    const remainingGreenCards = greenCards - revealedCards;
    const multiplier = remainingGreenCards > 0 ? totalCards / remainingGreenCards : 1;

    console.log('CalculateReward: Multiplier:', multiplier);
    return betAmount * multiplier; // Reward based on initial bet amount
}

// Function to update wallet balance locally and on the server
function updateWallet(amount) {
    walletAmount += amount;
    if (walletAmount < 0) walletAmount = 0;

    // Update wallet in localStorage and display
    localStorage.setItem('wallet', walletAmount);
    document.querySelector('.wallet-amount').textContent = `$${walletAmount.toFixed(2)}`;
    console.log('UpdateWallet: New wallet amount:', walletAmount);

    // Sync with the backend
    updateServerWallet();
}

// Function to sync wallet balance with the server
async function updateServerWallet() {
    const email = localStorage.getItem('currentUser');
    try {
        await fetch('http://localhost:3000/wallet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, wallet: walletAmount }),
        });
        console.log('UpdateServerWallet: Wallet updated on the server.');
    } catch (error) {
        console.error('UpdateServerWallet: Error updating wallet:', error);
    }
}

// Function to reveal all cards after hitting a mine
function revealAllCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        if (minePositions.includes(index)) {
            card.style.backgroundColor = 'red'; // Bomb color
        } else {
            card.style.backgroundColor = 'green'; // Safe card color
        }
        card.classList.add('clicked');
    });
    console.log('RevealAllCards: All cards revealed.');
}

// Function to reset the game board
function resetGame() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('clicked');
        card.style.backgroundColor = '#61dafb'; // Default card color
    });
    currentBetAmount = 0;
    document.querySelector('.current-bet-amount').textContent = `$0.00`;
    console.log('ResetGame: Game reset.');
}

// Utility function to generate random mine positions
function generateMinePositions(totalCards, minesCount) {
    const positions = new Set();
    while (positions.size < minesCount) {
        const randomIndex = Math.floor(Math.random() * totalCards);
        positions.add(randomIndex);
    }
    return Array.from(positions);
}

// Function to handle "Cashout"
function handleCashout() {
    if (currentBetAmount > 0) {
        alert(`You cashed out with $${currentBetAmount.toFixed(2)}!`);
        updateWallet(currentBetAmount);
        resetGame();
        console.log('HandleCashout: Cashout successful. Amount:', currentBetAmount);
    } else {
        alert('No winnings to cash out. Play the game first!');
        console.log('HandleCashout: No winnings to cash out.');
    }
}

// Initialize the game on page load
window.onload = function () {
    if (localStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'index.html';
    } else {
        initializeWallet();
    }
};

// Sign-out functionality
function signOut() {
    localStorage.clear();
    window.location.href = 'index.html';
    console.log('SignOut: User signed out.');
}

// Event listeners for game buttons
document.querySelector('.bet-button').addEventListener('click', startGame);
document.querySelector('.cashout-button').addEventListener('click', handleCashout);
