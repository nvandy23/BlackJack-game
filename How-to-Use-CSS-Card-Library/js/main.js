/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const originalDeck = buildOriginalDeck();
// renderDeckInContainer(originalDeck, document.getElementById('original-deck-container'));
let shuffledDeck;
const startButton = document.querySelector('#start--button')
const startScreenContainer = document.querySelector("#start--screen--container")
const gameBoardContainer = document.querySelector('#game--board--container');
const shuffledContainer = document.getElementById('shuffled-deck-container');
const playerHand =[]
const compHand =[]
const playerScore = 0
const compScore = 0
let playerCard1
let playerCard2
let compCard1
let compCard2

// start game
function startGame() {
  startScreenContainer.style.display = 'none';
  gameBoardContainer.style.display = 'block';
  playerCard1 = shuffledDeck.pop()
  playerCard2 = shuffledDeck.shift()
  compCard1 = shuffledDeck.pop()
  compCard2 = shuffledDeck.shift()
  // return playerCards
console.log(playerCard1)
console.log(playerCard2)
console.log(compCard1)
console.log (compCard2)

  

}
startButton.addEventListener('click', startGame);












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

// function renderDeckInContainer(deck, container) {
//   container.innerHTML = '';
//   let cardsHtml = '';
//   deck.forEach(function(card) {
//     cardsHtml += `<div class="card ${card.face}"></div>`;
//   });
//   container.innerHTML = cardsHtml;
// }

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