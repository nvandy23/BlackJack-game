/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const originalDeck = buildOriginalDeck();
const startButton = document.querySelector('#start--button')
const startScreenContainer = document.querySelector("#start--screen--container");
const gameBoardContainer = document.querySelector('#game--board--container');
const shuffledContainer = document.getElementById('shuffled-deck-container');
const playerHandContainer = document.querySelector('#player--hand--container');
const dealerHandContainer = document.querySelector('#dealer--hand--container');
const playerHand =[]
const dealerHand =[]
const playerScore = 0
const dealerScore = 0
let playerCard1
let playerCard2
let dealerCard1
let dealerCard2
let shuffledDeck;



// start game
function startGame() {
startScreenContainer.style.display = 'none';
gameBoardContainer.style.display = 'block';
 getPlayerHand()
 getDealerHand()
console.log(playerCard1)
console.log(playerCard2)
console.log(dealerCard1)
console.log (dealerCard2)
console.log(playerHand)
console.log(dealerHand)
}

startButton.addEventListener('click', startGame);

// get and return player hand. Render hand in container.
function getPlayerHand() {
playerCard1 = shuffledDeck.pop()
playerCard2 = shuffledDeck.shift()
playerHand.push(playerCard1,playerCard2)
renderDeckInContainer(playerHand,playerHandContainer);
return playerHand
}

// get and return dealer hand. Render hand in container.
function getDealerHand () {
dealerCard1 = shuffledDeck.pop()
dealerCard2 = shuffledDeck.shift()
dealerHand.push(dealerCard1, dealerCard2)
renderDeckInContainer(dealerHand,dealerHandContainer);
return dealerHand
}

// document.querySelector('button').addEventListener('click', renderNewShuffledDeck);

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
  // renderDeckInContainer(shuffledDeck, shuffledContainer);
}

function renderDeckInContainer(deck, container) {
  container.innerHTML = '';
  let cardsHtml = '';
  deck.forEach(function(card) {
    cardsHtml += `<div class="card ${card.face}"></div>`;
  });
  container.innerHTML = cardsHtml;
}

function buildOriginalDeck() {
  const deck = [];
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      deck.push({
        face: `${suit}${rank}`,
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}
console.log(buildOriginalDeck())
renderNewShuffledDeck();