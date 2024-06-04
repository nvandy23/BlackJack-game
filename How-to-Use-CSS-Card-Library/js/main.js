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
const amountDeposited = document.querySelector('#amount--deposited')
const amountDepositedText = document.querySelector('#amount--deposited--text')
const allDepositButtons =document.querySelectorAll('#all--deposit--buttons--container button')
const maximumDepositAmountText = document.querySelector('.max--deposit--text')
const customAmountInput = document.getElementById("custom-amount");
const amountDepositedSpan = document.getElementById("amount--deposited");
const resetDepositButton =document.querySelector('#reset--deposit--button')
const allWagerButtons =document.querySelectorAll('#all--wagers--container button')
const yourBetAmount =document.querySelector('#your--bet--amount')
const yourChips = document.querySelector('#your--chips')
const button4 = document.querySelector('#button4');
const wagerRange =document.querySelector("#wager--range")
const resetWagerButton =document.querySelector('#reset--wager--button')
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





function handleDepositClick() {
  let parseAmountDeposited = parseInt(amountDeposited.textContent, 10);
  let parseDepositAmount = parseInt(this.textContent.trim(), 10);
  parseAmountDeposited += parseDepositAmount;
  if (parseAmountDeposited > 10000) {
    amountDeposited.textContent = 10000;
  } else {
    amountDeposited.textContent = parseAmountDeposited;
  }
  yourChips.textContent = parseInt(`${amountDeposited.textContent}`);
}

allDepositButtons.forEach(button => {
  button.addEventListener('click', handleDepositClick);
});

resetDepositButton.addEventListener('click', function(evt) {
  amountDeposited.textContent = 0;
  customAmountInput.value = "";
  console.log(evt)
});
function removeHitStandButton() {
  hitButton.removeEventListener('click', getAnotherPlayerCard);
  standButton.removeEventListener('click', stand);
}





// Handle custom deposit amount input validation
customAmountInput.addEventListener("input", function() {
  let enteredAmount = parseInt(this.value, 10);
  if (isNaN(enteredAmount) || enteredAmount < 100) {
    this.setCustomValidity("Please enter an amount of at least 100.");
  } else if (enteredAmount > 10000) {
    this.setCustomValidity("This amount exceeds 10000.");
  } else {
    this.setCustomValidity(""); 
  }

  if (!isNaN(enteredAmount) && enteredAmount >= 100 && enteredAmount <= 10000) {
    amountDeposited.textContent = enteredAmount;
    yourChips.textContent = enteredAmount
    setWagerContents()
  } else {
    amountDeposited.textContent = 0;
  }
  this.reportValidity();
})





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
console.log(getNewShuffledDeck())

function renderNewShuffledDeck() {
  shuffledDeck = getNewShuffledDeck();
}

// Function to show value of player hand
function showPlayerHandValue() {
  playerSum = calculateHandValue(playerHand);
  playerHandValue.textContent = playerSum;
  checkPlayerDealerBust();
}

// Function to show value of dealer hand
function saveDealerHandValue() {
  dealerSum = calculateHandValue(dealerHand);
}

// Start game 
function startGame() {
  startScreenContainer.style.display = 'none';
  gameBoardContainer.style.display = 'block';
  resetHands();
  getNewShuffledDeck();
  renderNewShuffledDeck();
  getPlayerHand();
  getDealerHand();
  showPlayerHandValue();
  saveDealerHandValue();
  setWagerContents()
  removeHitStandButton()
  yourBetAmount.textContent = 0
}



startButton.addEventListener('click', startGame);
newHandButton.addEventListener('click', resetGame);


resetWagerButton.addEventListener('click', handleResetWagerButtonClick);


function setWagerContents() {
  allWagerButtons.forEach(button => {
    button.removeEventListener('click', handleWagerButtonClick);
  });

  allWagerButtons.forEach((button, idx) => {
    switch (idx) {
      case 0:
        button.textContent = `${amountDeposited.textContent * 0.05}`;
        break;
      case 1:
        button.textContent = `${amountDeposited.textContent * 0.10}`;
        break;
      case 2:
        button.textContent = `${amountDeposited.textContent * 0.20}`;
        break;
      case 3:
        const maxWager = Math.min(parseInt(amountDeposited.textContent * 0.50), parseInt(amountDeposited.textContent));
        wagerRange.setAttribute('max', maxWager);
        button.textContent = parseInt(`${wagerRange.value}`);
        break;
    }
  
    button.addEventListener('click', handleWagerButtonClick);
    button.disabled = false;
  });
}  
function handleWagerButtonClick(event) {
  console.log("Button text content before parsing:", event.target.textContent);
  
  let wagerAmount = parseInt(event.target.textContent, 10);
  console.log("Wager amount after parsing:", wagerAmount);
  allWagerButtons.forEach(wagerButton => {
    wagerButton.disabled = true;
  });

  console.log("Before parsing:", yourChips.textContent);
  
  let remainingChips = parseInt(yourChips.textContent) - wagerAmount;
  console.log("Remaining chips:", remainingChips);
  
  yourChips.textContent = remainingChips;
  yourBetAmount.textContent = parseInt(wagerAmount);
  console.log("your chips:", yourBetAmount.textContent);

  hitButton.addEventListener('click', getAnotherPlayerCard);
  standButton.addEventListener('click', stand);
}

function handleResetWagerButtonClick() {
  addWagerButtonListeners();
  let returnedChips = parseInt(yourChips.textContent) + parseInt(yourBetAmount.textContent);
  yourChips.textContent = parseInt(returnedChips);
  yourBetAmount.textContent = 0;
  resetWagerButton.addEventListener('click', handleResetWagerButtonClick);
}





function handleWagerRangeChange() {
  setWagerContents(); 
}

wagerRange.addEventListener('input', handleWagerRangeChange);






// Helper function to calculate hand value considering aces
function calculateHandValue(hand) {
  let sum = 0;
  let aceCount = 0;

  hand.forEach(card => {
    if (card.face.endsWith('A')) {
      aceCount += 1;
      sum += 11;
    } else {
      sum += card.value;
    }
  });

  while (sum > 21 && aceCount > 0) {
    sum -= 10;
    aceCount -= 1;
  }

  return sum;
}

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
  saveDealerHandValue()
}
// hitButton.addEventListener('click', getAnotherPlayerCard);

// Dealer draws cards until the total is above 16
function checkdealerSum () {
  while (dealerSum <= 16) {
    const newDealerCard = shuffledDeck.pop();
    dealerHand.push(newDealerCard);
    renderCardsInContainer(dealerHand, dealerHandContainer);
    saveDealerHandValue();
  }
}

function stand() {

  // Show the dealer's hidden card
  const hiddenCard = dealerHandContainer.querySelector('.back');
  if (hiddenCard) {
    hiddenCard.classList.remove('back');
  }
  
  
  displayWinLose();
  checkdealerSum();
}

// standButton.addEventListener('click', stand);

const winLoseDisplay = document.createElement('p');

button4.insertAdjacentElement("afterend", winLoseDisplay);

// Display win/lose message
function displayWinLose() {
  checkdealerSum();
  if (playerSum > 21 && dealerSum > 21) {
    winLoseDisplay.textContent = "It's a push! You get your original bet back.";
  } else if (playerSum > 21) {
    winLoseDisplay.textContent = "You busted! Dealer wins.";
  } else if (playerSum < dealerSum && dealerSum === 21) {
    winLoseDisplay.textContent = "Dealer has a blackjack. You lost";
  } else if (playerSum > dealerSum && playerSum === 21) {
    winLoseDisplay.textContent = "You have a blackjack! You win!";
  } else if (dealerSum > 21) {
    winLoseDisplay.textContent = "Dealer busted! You win!";
  } else if (playerSum > dealerSum) {
    winLoseDisplay.textContent = "You win!";
  } else if (playerSum < dealerSum) {
    winLoseDisplay.textContent = "You lose.";
  } else {
    winLoseDisplay.textContent = "It's a tie.";
  }
  hitButton.removeEventListener('click', getAnotherPlayerCard);
  standButton.removeEventListener('click', stand);
  dealerHandValue.textContent = dealerSum;
  allWagerButtons.forEach(button => {
    button.disabled =true
  })
  resetWagerButton.disabled = true
}

function addWagerButtonListeners() {
  allWagerButtons.forEach(button => {
    button.addEventListener('click', handleWagerButtonClick);
    button.disabled = false; // Enable the button
  });
}

// Reset the game once the new hand button is clicked.
function resetGame() {
  resetHands();
  renderNewShuffledDeck();
  getPlayerHand();
  getDealerHand();
  showPlayerHandValue();
  winLoseDisplay.textContent ='';
  removeHitStandButton()
  addWagerButtonListeners()
  resetWagerButton.disabled = false

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
  hitButton.addEventListener('click', getAnotherPlayerCard);
  standButton.addEventListener('click', stand);
  yourBetAmount.textContent = 0;
}


function cashedOut() {
  gameBoardContainer.style.display = "none";
  cashOutContainer.style.display = "block";
}
cashOutButton.addEventListener('click', cashedOut);

// Check if player or dealer has busted
function checkPlayerDealerBust() {
  if (playerSum > 21) {
    saveDealerHandValue();
    renderCardsInContainer(dealerHand, dealerHandContainer);
    displayWinLose();
  }
}


