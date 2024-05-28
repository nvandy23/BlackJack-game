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
const dealerHandValue = document.querySelector('#dealer--hand--value')
const playerHandValue = document.querySelector('#player--hand--value')
const playerChips = document.querySelector('#Your--chips')
const hitButton = document.querySelector('#hit--button')
const standButton = document.querySelector('#stand--button')
const newHandButton =document.querySelector('#hand--button')
const cashOutButton =document.querySelector('#cash--out--button')
const cashOutContainer =document.querySelector('#cash--out--conatiner')
const playerHand =[]
const dealerHand =[]
let playerScore = 0
let playerCard1
let playerCard2
let dealerCard1
let dealerCard2
let shuffledDeck
let sum = 0 
let sum2 = 0




// build original deck 
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

//setup render player and dealer hand container function 
function renderCardsInContainer(deck, container) {
  container.innerHTML = '';
  let cardsHtml = '';
  deck.forEach(function(card) {
    cardsHtml += `<div class="card ${card.face}"></div>`;
  });
  container.innerHTML = cardsHtml;
}

// get new shuffled Deck
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

console.log(buildOriginalDeck())
renderNewShuffledDeck();

// function to show value of player hand
function showPlayerHandValue () {
  for (const score of playerHand) {
    sum += score.value
    playerHandValue.textContent = sum
    }
}

// function to show value of dealer hand
function showDealerHandValue (){
  for(const score2 of dealerHand) {
    sum2 += score2.value
    dealerHandValue.textContent = sum2
  
  }
}

// start game
function startGame() {
startScreenContainer.style.display = 'none';
gameBoardContainer.style.display = 'block';
 getPlayerHand()
 getDealerHand()
 showPlayerHandValue()
 showDealerHandValue()
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
renderCardsInContainer(playerHand,playerHandContainer);
return playerHand
}

// get and return dealer hand. Render hand in container.
function getDealerHand () {
dealerCard1 = shuffledDeck.pop()
dealerCard2 = shuffledDeck.shift()
dealerHand.push(dealerCard1, dealerCard2)
renderCardsInContainer(dealerHand,dealerHandContainer);
// NOT the best way to do this at all. Need to swing back and create a conditional in rendering deck function. DON'T COPY THIS.
const hiddenCard = dealerHandContainer.firstChild
hiddenCard.classList.add('card', 'back') 
return dealerHand
}

// function to get new card for player when player clicks hit button
function getAnotherPlayerCard() {
    const newCard = shuffledDeck.pop();
    playerHand.push(newCard);
    renderCardsInContainer(playerHand, playerHandContainer); 
    console.log(playerHand)
    showPlayerHandValue()
  
}
hitButton.addEventListener('click',getAnotherPlayerCard)

// stand function. If dealer value is 16 or under, dealer has to stand. Otherwise they have to draw another card.
function stand () {
 if(sum2 === 16 || sum2 < 16) {
  const newDealerCard = shuffledDeck.pop()
  dealerHand.push(newDealerCard)
  console.log(dealerHand)
  renderCardsInContainer(dealerHand, dealerHandContainer); 
  showDealerHandValue()
 }
}
standButton.addEventListener('click', stand)

// reset the game once the new hand button is clicked.
function resetGame() {
  playerHand.length = 0;
  dealerHand.length = 0;
  playerScore = 0;
  sum = 0;
  sum2 = 0;
  renderNewShuffledDeck();
  playerHandContainer.innerHTML = '';
  dealerHandContainer.innerHTML = '';
  playerHandValue.textContent = '';
  dealerHandValue.textContent = '';
  getPlayerHand();
  getDealerHand();
  showPlayerHandValue();
  showDealerHandValue();
}
newHandButton.addEventListener('click', resetGame);

function cashedOut () { 
  gameBoardContainer.style.display ="none"
  cashOutContainer.style.display ="block"
}

cashOutButton.addEventListener('click',cashedOut)