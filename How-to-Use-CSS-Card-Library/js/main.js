/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const originalDeck = buildOriginalDeck();
const startButton = document.querySelector('#start--button');
const startScreenContainer = document.querySelector("#start--screen--container");
const gameBoardContainer = document.querySelector('#game--board--container');
const shuffledContainer = document.getElementById('shuffled-deck-container');
const playerHandContainer = document.querySelector('#player--hand--container');
const dealerHandContainer = document.querySelector('#dealer--hand--container');
const dealerHandValue = document.querySelector('#dealer--hand--value');
const playerHandValue = document.querySelector('#player--hand--value');
const playerChips = document.querySelector('#Your--chips');
const hitButton = document.querySelector('#hit--button');
const standButton = document.querySelector('#stand--button');
const newHandButton = document.querySelector('#hand--button');
const cashOutButton = document.querySelector('#cash--out--button');
const cashOutContainer = document.querySelector('#cash--out--conatiner');
const button4 = document.querySelector('#button4');
const playerHand = [];
const dealerHand = [];
let playerScore = 0;
let playerCard1;
let playerCard2;
let dealerCard1;
let dealerCard2;
let shuffledDeck;
let playerSum = 0;
let dealerSum = 0;

// Build original deck 
function buildOriginalDeck() {
  const deck = [];
  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({
        face: `${suit}${rank}`,
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}

// Setup render player and dealer hand container function 
function renderCardsInContainer(deck, container) {
  container.innerHTML = '';
  let cardsHtml = '';
  deck.forEach(function (card) {
    cardsHtml += `<div class="card ${card.face}"></div>`;
  });
  container.innerHTML = cardsHtml;
}

// Get new shuffled Deck
function getNewShuffledDeck() {
  const tempDeck = [...originalDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}

function renderNewShuffledDeck() {
  shuffledDeck = getNewShuffledDeck();
}

// Function to show value of player hand
function showPlayerHandValue() {
  playerSum = 0;
  for (const card of playerHand) {
    playerSum += card.value;
  }
  playerHandValue.textContent = playerSum;
  checkPlayerDealerBust();
}

// Function to show value of dealer hand
function showDealerHandValue() {
  dealerSum = 0;
  for (const card of dealerHand) {
    dealerSum += card.value;
  }
  dealerHandValue.textContent = dealerSum;
}

// Start game
function startGame() {
  startScreenContainer.style.display = 'none';
  gameBoardContainer.style.display = 'block';
  resetHands();
  renderNewShuffledDeck();
  getPlayerHand();
  getDealerHand();
  showPlayerHandValue();
}

startButton.addEventListener('click', startGame);

// Get and return player hand. Render hand in container.
function getPlayerHand() {
  playerCard1 = shuffledDeck.pop();
  playerCard2 = shuffledDeck.shift();
  playerHand.push(playerCard1, playerCard2);
  renderCardsInContainer(playerHand, playerHandContainer);
  return playerHand;
}

// Get and return dealer hand. Render hand in container.
function getDealerHand() {
  dealerCard1 = shuffledDeck.pop();
  dealerCard2 = shuffledDeck.shift();
  dealerHand.push(dealerCard1, dealerCard2);
  renderCardsInContainer(dealerHand, dealerHandContainer);
  // Hide one of the dealer's cards
  const hiddenCard = dealerHandContainer.firstChild;
  hiddenCard.classList.add('card', 'back');
  return dealerHand;
}

// Function to get new card for player when player clicks hit button
function getAnotherPlayerCard() {
  const newCard = shuffledDeck.pop();
  playerHand.push(newCard);
  renderCardsInContainer(playerHand, playerHandContainer);
  showPlayerHandValue();
  if (playerSum > 21) {
    displayWinLose();
  }
}
hitButton.addEventListener('click', getAnotherPlayerCard);

// Stand function. Dealer draws until value is above 16.
function stand() {
  while (dealerSum <= 16) {
    const newDealerCard = shuffledDeck.pop();
    dealerHand.push(newDealerCard);
    renderCardsInContainer(dealerHand, dealerHandContainer);
    showDealerHandValue();
  }
  displayWinLose()
}
standButton.addEventListener('click', stand);

// Display win/lose message
function displayWinLose() {
  const winLoseDisplay = document.createElement('p');
  button4.insertAdjacentElement("afterend", winLoseDisplay);
  if (playerSum > 21) {
    winLoseDisplay.textContent = "You busted! Dealer wins.";
  } else if (dealerSum > 21) {
    winLoseDisplay.textContent = "Dealer busted! You win.";
  } else if (playerSum > dealerSum) {
    winLoseDisplay.textContent = "You win.";
  } else if (playerSum < dealerSum) {
    winLoseDisplay.textContent = "You lose.";
  } else {
    winLoseDisplay.textContent = "It's a tie.";
  }
  showDealerHandValue()
}

// Reset the game once the new hand button is clicked.
function resetGame() {
  resetHands();
  renderNewShuffledDeck();
  getPlayerHand();
  getDealerHand();
  showPlayerHandValue();
}
newHandButton.addEventListener('click', resetGame);

function resetHands() {
  playerHand.length = 0;
  dealerHand.length = 0;
  playerSum = 0;
  dealerSum = 0;
  playerHandContainer.innerHTML = '';
  dealerHandContainer.innerHTML = '';
  playerHandValue.textContent = '';
  dealerHandValue.textContent = '';
}

function cashedOut() {
  gameBoardContainer.style.display = "none";
  cashOutContainer.style.display = "block";
}
cashOutButton.addEventListener('click', cashedOut);

// Check if player or dealer has busted
function checkPlayerDealerBust() {
  if (playerSum > 21) {
    showDealerHandValue();
    renderCardsInContainer(dealerHand, dealerHandContainer);
    displayWinLose();
  }
}


