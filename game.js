// Global variables
let minePositions = [];
let walletAmount = 10000; // Default wallet amount
let betAmount = 0;
let numberOfMines = 0;
let currentBetAmount = 0; // Store the bet amount for the current game

// Function to show the custom modal with a message
function showModal(message) {
  const modal = document.getElementById('custom-modal');
  const modalMessage = document.getElementById('modal-message');
  modalMessage.textContent = message;
  modal.style.display = 'block';
}

// Function to hide the custom modal
function hideModal() {
  const modal = document.getElementById('custom-modal');
  modal.style.display = 'none';
}

// Event listener for the "OK" button in the modal
document.getElementById('modal-ok-button').addEventListener('click', hideModal);

// Event listener for the "close" button in the modal
document.querySelector('.close-button').addEventListener('click', hideModal);

// Function to start the game and place mines
function startGame() {
  const cards = document.querySelectorAll('.card');
  const minesInput = document.getElementById('mines');
  const betInput = document.getElementById('bet-amount');
  
  numberOfMines = parseInt(minesInput.value, 10);
  betAmount = parseInt(betInput.value, 10);

  // Validate number of mines
  if (isNaN(numberOfMines) || numberOfMines <= 0 || numberOfMines > 24) {
    showModal('Invalid number of mines. Please enter a number between 1 and 24.');
    return;
  }

  // Validate bet amount
  if (isNaN(betAmount) || betAmount <= 0 || betAmount > walletAmount) {
    showModal('Invalid bet amount. Please enter a valid bet.');
    return;
  }

  // Deduct the bet amount from the wallet
  updateWallet(-betAmount);
  currentBetAmount = betAmount;
  document.querySelector('.current-bet-amount').textContent = `$${currentBetAmount.toFixed(2)}`;

  // Reset the game and set the new mines
  resetGame();
  minePositions = [];
  const cardIndices = [...Array(cards.length).keys()];
  shuffleArray(cardIndices);
  minePositions = cardIndices.slice(0, numberOfMines);

  // Debugging
  console.log("Mine positions:", minePositions);
}

// Function to handle card click events
function changeColor(card) {
  if (card.classList.contains('clicked')) return;

  if (currentBetAmount <= 0) {
    showModal('Please enter a valid bet amount to reveal the cards.');
    return;
  }

  const cards = Array.from(document.querySelectorAll('.card'));
  const cardIndex = cards.indexOf(card);
  const isMine = minePositions.includes(cardIndex);
  const image = isMine ? 'images/bomb.png' : 'images/gem.png';

  // Set the background image instead of color
  card.style.backgroundImage = `url(${image})`;
  card.style.backgroundSize = 'cover'; // Ensure the image covers the card
  card.classList.add('clicked');

  if (isMine) {
    revealAllCards();
    setTimeout(() => {
      showModal("BOOMED");
      setTimeout(resetGame, 2000); // Reset game after a delay
    }, 100); 
  } else {
    const reward = calculateReward();
    currentBetAmount = reward; // Update current bet amount to the reward
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

  return betAmount * multiplier; // Reward based on initial bet amount
}

// Function to update the wallet
function updateWallet(amount) {
  walletAmount += amount;
  if (walletAmount < 0) walletAmount = 0;

  document.querySelector('.wallet-amount').textContent = `$${walletAmount.toFixed(2)}`;
}

// Function to reveal all cards after a mine is hit
function revealAllCards() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    const isMine = minePositions.includes(index);
    const image = isMine ? 'images/bomb.png' : 'images/gem.png';
    card.style.backgroundImage = `url(${image})`;
    card.style.backgroundSize = 'cover';
  });
}

// Function to reset the game
function resetGame() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.classList.remove('clicked');
    card.style.backgroundColor = '#61dafb'; // Default color
    card.style.backgroundImage = 'none'; // Remove any background image
  });
  minePositions = [];
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

// Event listener for the "Bet" button
document.querySelector('.bet-button').addEventListener('click', startGame);

// Event listener for the "Cashout" button
document.querySelector('.cashout-button').addEventListener('click', () => {
  updateWallet(currentBetAmount);
  showModal(`You cashed out with $${walletAmount.toFixed(2)}`);
  currentBetAmount = 0;
  document.querySelector('.current-bet-amount').textContent = `$${currentBetAmount.toFixed(2)}`;
});

// Initialize wallet on page load
window.onload = function () {
  document.querySelector('.wallet-amount').textContent = `$${walletAmount.toFixed(2)}`;
};
