// Global variables
let minePositions = [];
let walletAmount = 10000; // Initial wallet amount
let betAmount = 0;
let numberOfMines = 0;
let currentBetAmount = 0; // Current bet amount for the game

// Function to initialize the wallet
function initializeWallet() {
    document.querySelector('.wallet-amount').textContent = `$${walletAmount.toFixed(2)}`;
}

// Function to handle "Start Game"
function startGame() {
    const cards = document.querySelectorAll('.card');
    const minesInput = document.getElementById('mines');
    const betInput = document.getElementById('bet-amount');
    
    numberOfMines = parseInt(minesInput.value, 10);
    betAmount = parseFloat(betInput.value);

    // Validate inputs
    if (isNaN(numberOfMines) || numberOfMines <= 0 || numberOfMines > 24) {
        alert('Please enter a valid number of mines (1-24).');
        return;
    }
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > walletAmount) {
        alert('Please enter a valid bet amount (within your wallet balance).');
        return;
    }

    // Deduct the bet amount from wallet
    updateWallet(-betAmount);
    currentBetAmount = betAmount;
    document.querySelector('.current-bet-amount').textContent = `$${currentBetAmount.toFixed(2)}`;

    // Reset and setup mines
    resetGame();
    minePositions = [];
    const cardIndices = [...Array(cards.length).keys()];
    shuffleArray(cardIndices);
    minePositions = cardIndices.slice(0, numberOfMines);

    console.log('Mines set at positions:', minePositions); // Debugging
}

// Function to handle card clicks
function changeColor(card) {
    if (card.classList.contains('clicked')) return;

    const cards = Array.from(document.querySelectorAll('.card'));
    const cardIndex = cards.indexOf(card);
    const isMine = minePositions.includes(cardIndex);

    if (isMine) {
        card.style.backgroundColor = 'red'; // Bomb color
        card.classList.add('clicked');
        revealAllCards();
        setTimeout(() => {
            alert('BOOM! You hit a mine!');
            resetGame();
        }, 100);
    } else {
        card.style.backgroundColor = 'green'; // Safe color
        card.classList.add('clicked');
        const reward = calculateReward();
        currentBetAmount = reward; // Update the current bet amount as the reward
        document.querySelector('.current-bet-amount').textContent = `$${currentBetAmount.toFixed(2)}`;
    }
}

// Function to calculate the reward
function calculateReward() {
    const totalCards = 25;
    const greenCards = totalCards - numberOfMines;
    const revealedCards = document.querySelectorAll('.card.clicked').length;
    const remainingGreenCards = greenCards - revealedCards;
    const multiplier = remainingGreenCards > 0 ? totalCards / remainingGreenCards : 1;

    return currentBetAmount * multiplier; // Reward multiplier
}

// Function to update wallet balance
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
            card.style.backgroundColor = 'red'; // Reveal mine
        } else {
            card.style.backgroundColor = 'green'; // Reveal safe cards
        }
        card.classList.add('clicked');
    });
}

// Function to reset the game
function resetGame() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.remove('clicked');
        card.style.backgroundColor = '#61dafb'; // Default color
    });
    currentBetAmount = 0;
    document.querySelector('.current-bet-amount').textContent = `$0.00`;
}

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Event listeners
document.querySelector('.bet-button').addEventListener('click', startGame);
document.querySelector('.cashout-button').addEventListener('click', () => {
    updateWallet(currentBetAmount);
    alert(`You cashed out with $${currentBetAmount.toFixed(2)}!`);
    resetGame();
});

// Initialize the game on page load
window.onload = function () {
    if (localStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'index.html'; // Redirect to login if not logged in
    }
    initializeWallet();
};
