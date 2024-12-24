// Global variables
let minePositions = []; // Stores the positions of bombs
let walletAmount = 10000; // Initial wallet amount
let betAmount = 0; // Player's current bet
let numberOfMines = 0; // Number of mines set by the player
let currentBetAmount = 0; // Tracks the reward for the current game

// Function to initialize wallet balance on page load
function initializeWallet() {
    document.querySelector('.wallet-amount').textContent = `$${walletAmount.toFixed(2)}`;
}

// Function to start the game and set up mines
function startGame() {
    const cards = document.querySelectorAll('.card');
    const minesInput = document.getElementById('mines');
    const betInput = document.getElementById('bet-amount');
    
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

// Function to handle clicking on a card
function changeColor(card) {
    if (card.classList.contains('clicked')) return; // Prevent re-clicking on the same card

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
    } else {
        card.style.backgroundColor = 'green'; // Safe card color
        card.classList.add('clicked');
        const reward = calculateReward();
        currentBetAmount = reward; // Update the current bet amount
        document.querySelector('.current-bet-amount').textContent = `$${currentBetAmount.toFixed(2)}`;
    }
}

// Function to calculate reward based on remaining safe cards
function calculateReward() {
    const totalCards = 25;
    const greenCards = totalCards - numberOfMines;
    const revealedCards = document.querySelectorAll('.card.clicked').length;
    const remainingGreenCards = greenCards - revealedCards;
    const multiplier = remainingGreenCards > 0 ? totalCards / remainingGreenCards : 1;

    return currentBetAmount * multiplier; // Reward multiplier
}

// Function to update the wallet balance
function updateWallet(amount) {
    walletAmount += amount;
    if (walletAmount < 0) walletAmount = 0;
    document.querySelector('.wallet-amount').textContent = `$${walletAmount.toFixed(2)}`;
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
    } else {
        alert('No winnings to cash out. Play the game first!');
    }
}

// Event listeners for game buttons
document.querySelector('.bet-button').addEventListener('click', startGame);
document.querySelector('.cashout-button').addEventListener('click', handleCashout);

// Initialize the game on page load
window.onload = function () {
    if (localStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'index.html'; // Redirect to login if not logged in
    }
    initializeWallet();
};
