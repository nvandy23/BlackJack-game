/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const originalDeck = buildOriginalDeck();
const startButton = document.querySelector('#start--button');
const startScreenContainer = document.querySelector("#start--screen--container");
const startScreenHeader =document.querySelector('#start--screen--header')
const startScreenText =document.querySelector('#start--screen--text')
const gameBoardContainer = document.querySelector('#game--board--container');
const shuffledContainer = document.getElementById('shuffled-deck-container');
const playerHandContainer = document.querySelector('#player--hand--container');
const dealerHandContainer = document.querySelector('#dealer--hand--container');
const dealerHandValue = document.querySelector('#dealer--hand--value');
const playerHandValue = document.querySelector('#player--hand--value');
const playerChips = document.querySelector('#your--chips');
const hitButton = document.querySelector('#hit--button');
const standButton = document.querySelector('#stand--button');
const newHandButton = document.querySelector('#hand--button');
const cashOutButton = document.querySelector('#cash--out--button');
const cashOutContainer = document.querySelector('#cash--out--container');
const amountDeposited = document.querySelector('#amount--deposited');
const amountDepositedText = document.querySelector('#amount--deposited--text');
const allDepositButtons = document.querySelectorAll('#all--deposit--buttons--container button');
const maximumDepositAmountText = document.querySelector('.max--deposit--text');
const customAmountInput = document.getElementById("custom-amount");
const amountDepositedSpan = document.getElementById("amount--deposited");
const resetDepositButton = document.querySelector('#reset--deposit--button');
const allWagerButtons = document.querySelectorAll('#all--wagers--container button');
const yourBetAmount = document.querySelector('#your--bet--amount');
const yourChips = document.querySelector('#your--chips');
const button4 = document.querySelector('#button4');
const wagerRange = document.querySelector("#wager--range");
const resetWagerButton = document.querySelector('#reset--wager--button');
const gameOverContainer = document.querySelector('#game--over--container');
const cashOutMessage = document.querySelector('#cashout-message');
const continuePlayingButton =document.querySelector('#continue--playing')
const addChipsButton =document.querySelector("#add--chips")
const playerDeposit =document.querySelector('#player--deposit--container')
const startOverButton =document.querySelector('#start--over--button')
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
let cashedOutChips = document.createElement('p')
startButton.disabled=true;

function handleDepositClick() {
    let parseAmountDeposited = parseInt(amountDeposited.textContent, 10);
    let parseDepositAmount = parseInt(this.textContent.trim(), 10);
    console.log("Deposit Amount:", parseDepositAmount);
    console.log("Current Deposited:", parseAmountDeposited);
    parseAmountDeposited += parseDepositAmount;

    if (parseAmountDeposited > 10000) {
        amountDeposited.textContent = 10000;
        yourChips.textContent = 10000;
        cashedOutChips.textContent = 10000;
    } else {
        amountDeposited.textContent = parseAmountDeposited;
        yourChips.textContent = parseAmountDeposited;
        startButton.disabled=false;
    }
    

    if (cashedOutChips) {
        if(parseAmountDeposited > 10000){
            cashedOutChips.textContent = "Your chips remaining: 10000";
        }
        else{
            cashedOutChips.textContent = `Your chips remaining: ${parseAmountDeposited}`;
        }
        }
    
    
    console.log("New Deposited:", parseInt(amountDeposited.textContent, 10));
    console.log("Chips:", parseInt(yourChips.textContent, 10));
    yourBetAmount.textContent = 0;
    console.log("Your current bet:", parseInt(yourBetAmount.textContent, 10));
}

allDepositButtons.forEach(button => {
    button.addEventListener('click', handleDepositClick);
});

resetDepositButton.addEventListener('click', function(evt) {
    amountDeposited.textContent = 0;
    customAmountInput.value = "";
    console.log("Reset Deposit Button Clicked", evt);
    startButton.disabled =true;

});

customAmountInput.addEventListener("input", function() {
    let enteredAmount = parseInt(this.value, 10);
    if (isNaN(enteredAmount) || enteredAmount < 100) {
        this.setCustomValidity("Please enter an amount of at least 100.");
        startButton.disabled=true
    } else if (enteredAmount > 10000) {
        this.setCustomValidity("This amount exceeds 10000.");
        startButton.disabled=true
    } else {
        this.setCustomValidity("");
        startButton.disabled=false;
    }

    if (!isNaN(enteredAmount) && enteredAmount >= 100 && enteredAmount <= 10000) {
        amountDeposited.textContent = enteredAmount;
        yourChips.textContent = enteredAmount;
        
        setWagerContents();
        startButton.disabled=false;
    } else {
        amountDeposited.textContent = 0;
    }
    this.reportValidity();
    console.log("Custom Amount Entered:", enteredAmount);
});


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


function getNewShuffledDeck() {
    const tempDeck = [...originalDeck];
    const newShuffledDeck = [];
    while (tempDeck.length) {
        const rndIdx = Math.floor(Math.random() * tempDeck.length);
        newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return newShuffledDeck;
}
console.log(getNewShuffledDeck());

function renderNewShuffledDeck() {
    shuffledDeck = getNewShuffledDeck();
}


function showPlayerHandValue() {
    playerSum = calculateHandValue(playerHand);
    playerHandValue.textContent = playerSum;
    checkPlayerDealerBust();
}


function saveDealerHandValue() {
    dealerSum = calculateHandValue(dealerHand);
}


function startGame() {
    if (cashedOutChips) {
        resetGame()
    }
    startScreenContainer.style.display = 'none';
    gameBoardContainer.style.display = 'block';
    resetHands();
    getNewShuffledDeck();
    renderNewShuffledDeck();
    getPlayerHand();
    getDealerHand();
    showPlayerHandValue();
    saveDealerHandValue();
    setWagerContents();
    hitButton.disabled = true;
    standButton.disabled = true;
    newHandButton.disabled = true;
    console.log("Amount Deposited Element:", amountDeposited);
console.log("Your Chips Element:", yourChips);
console.log("Your Bet Amount Element:", yourBetAmount);

}

startButton.addEventListener('click', startGame);
newHandButton.addEventListener('click', resetGame);

resetWagerButton.addEventListener('click', handleResetWagerButtonClick);

function setWagerContents() {
    allWagerButtons.forEach(button => {
        button.removeEventListener('click', handleWagerButtonClick);
    });

    allWagerButtons.forEach((button, idx) => {
        let yourChipsValue = parseInt(yourChips.textContent, 10);
        switch (idx) {
            case 0:
                button.textContent = `${Math.floor(yourChipsValue * 0.05)}`;
                break;
            case 1:
                button.textContent = `${Math.floor(yourChipsValue * 0.10)}`;
                break;
            case 2:
                button.textContent = `${Math.floor(yourChipsValue * 0.20)}`;
                break;
            case 3:
                const maxWager = Math.min(parseInt(yourChipsValue * 0.50, 10), yourChipsValue);
                wagerRange.setAttribute('max', maxWager);
                button.textContent = parseInt(wagerRange.value, 10);
                break;
        }

        button.disabled = false;
        
        button.addEventListener('click', handleWagerButtonClick);
       if(yourChipsValue <= parseInt(amountDeposited.textContent *.02)) {
        button.textContent = yourChipsValue
       }
       console.log(amountDeposited)
    });
}


function handleWagerRangeChange() {
  setWagerContents();
  allWagerButtons.forEach((button, idx) => {
      if (idx !== 3) {
          button.disabled = true;
      }
  });
  wagerRange.disabled = false; 
}


wagerRange.addEventListener('input', handleWagerRangeChange);

function handleWagerButtonClick(event) {
    let wagerAmount = parseInt(event.target.textContent, 10);
    console.log("Wager Amount:", wagerAmount);
    allWagerButtons.forEach(wagerButton => {
        wagerButton.disabled = true;
        hitButton.disabled = false;
        standButton.disabled = false;
        cashOutButton.disabled = true;
        if(wagerButton.disabled === true){
            wagerRange.style.display = "none";
        }
    });

    let remainingChips = parseInt(yourChips.textContent, 10) - wagerAmount;
    yourChips.textContent = remainingChips;
    yourBetAmount.textContent = wagerAmount;
    console.log("Remaining Chips:", remainingChips);
    console.log("Your Bet Amount:", wagerAmount);
    if(remainingChips === 0 && wagerAmount === 0) {
        gameOver()
    }

    hitButton.addEventListener('click', getAnotherPlayerCard);
    standButton.addEventListener('click', stand);
    newHandButton.disabled = true;
}

function handleResetWagerButtonClick() {
    addWagerButtonListeners();
    let returnedChips = parseInt(yourChips.textContent, 10) + parseInt(yourBetAmount.textContent, 10);
    yourChips.textContent = returnedChips;
    yourBetAmount.textContent = parseInt(0)
    console.log("returned chips:",returnedChips)
    newHandButton.disabled = false;
    hitButton.disabled = true;
    standButton.disabled = true;
    cashOutButton.disabled =false;
    wagerRange.style.display = "block";
}

function calculateHandValue(hand) {
    let sum = 0;
    let aceCount = 0;
    hand.forEach(card => {
        sum += card.value;
        if (card.value === 11) {
            aceCount++;
        }
    });
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount--;
    }
    return sum;
}

function getPlayerHand() {
    playerCard1 = shuffledDeck.pop();
    playerCard2 = shuffledDeck.shift();
    playerHand.push(playerCard1, playerCard2);
    renderCardsInContainer(playerHand, playerHandContainer);
    return playerHand;
}

function getDealerHand() {
    dealerCard1 = shuffledDeck.pop();
    dealerCard2 = shuffledDeck.shift();
    dealerHand.push(dealerCard1, dealerCard2);
    renderCardsInContainer(dealerHand, dealerHandContainer);
    const hiddenCard = dealerHandContainer.firstChild;
    hiddenCard.classList.add('card', 'back');
    return dealerHand;
}

function getAnotherPlayerCard() {
    const newCard = shuffledDeck.pop();
    playerHand.push(newCard);
    renderCardsInContainer(playerHand, playerHandContainer);
    showPlayerHandValue();
    saveDealerHandValue()
}

function checkdealerSum() {
    while (dealerSum <= 16) {
        const newDealerCard = shuffledDeck.pop();
        dealerHand.push(newDealerCard);
        renderCardsInContainer(dealerHand, dealerHandContainer);
        saveDealerHandValue();
    }
}

function stand() {
    const hiddenCard = dealerHandContainer.querySelector('.back');
    if (hiddenCard) {
        hiddenCard.classList.remove('back');
    }

    displayWinLose();
    checkdealerSum();
}

const winLoseDisplay = document.createElement('p');
button4.insertAdjacentElement("afterend", winLoseDisplay);

function displayWinLose() {
    checkdealerSum();
    const betAmount = parseInt(yourBetAmount.textContent, 10);
    if (playerSum > 21 && dealerSum > 21) {
        winLoseDisplay.textContent = "It's a push! You get your original bet back.";
        yourChips.textContent = betAmount + parseInt(yourChips.textContent, 10);
    } else if (playerSum > 21) {
        winLoseDisplay.textContent = "You busted! Dealer wins.";
    } else if (playerSum < dealerSum && dealerSum === 21) {
        winLoseDisplay.textContent = "Dealer has a blackjack. You lost.";
    } else if (playerSum > dealerSum && playerSum === 21) {
        winLoseDisplay.textContent = "You have a blackjack! You win!";
        yourChips.textContent = betAmount * 2 + parseInt(yourChips.textContent, 10);
    } else if (dealerSum > 21) {
        winLoseDisplay.textContent = "Dealer busted! You win!";
        yourChips.textContent = betAmount * 2 + parseInt(yourChips.textContent, 10);
    } else if (playerSum > dealerSum) {
        winLoseDisplay.textContent = "You win!";
        yourChips.textContent = betAmount * 2 + parseInt(yourChips.textContent, 10);
    } else if (playerSum < dealerSum) {
        winLoseDisplay.textContent = "You lose.";
    } else {            
        winLoseDisplay.textContent = "It's a tie.";
        betAmount + parseInt(yourChips.textContent, 10);
    }
    hitButton.removeEventListener('click', getAnotherPlayerCard);
    standButton.removeEventListener('click', stand);
    newHandButton.disabled = false;
    dealerHandValue.textContent = dealerSum;
    allWagerButtons.forEach(button => {
        button.disabled = true;
        cashOutButton.disabled = false;
        hitButton.disabled = true;
        standButton.disabled = true;
    });
    resetWagerButton.disabled = true;
    newHandButton.disabled = false;
    yourBetAmount.textContent = 0;
    const parsedYourChips = parseInt(yourChips.textContent, 10)
    console.log(parsedYourChips)
    const parsedYourBetAmount = parseInt(yourBetAmount.textContent,10)
    console.log(parsedYourBetAmount)
    if(parsedYourChips=== 0 && parsedYourBetAmount=== 0) {
    gameOverScreen()
}
    

}

function addWagerButtonListeners() {
    allWagerButtons.forEach(button => {
        button.addEventListener('click', handleWagerButtonClick);
        button.disabled = false;
    });
}

function resetGame() {
    resetHands();
    renderNewShuffledDeck();
    getPlayerHand();
    getDealerHand();
    showPlayerHandValue();
    winLoseDisplay.textContent = '';
    setWagerContents()
}

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
    addWagerButtonListeners();
    resetWagerButton.disabled = false;
    wagerRange.style.display = "block";
    newHandButton.disabled = true;
}

function cashedOut() {
    gameBoardContainer.style.display = "none";
    cashOutContainer.style.display = "block";
    cashOutMessage.textContent = `You cashed out with ${yourChips.textContent} chips remaining`;
}
cashOutButton.addEventListener('click', cashedOut);

function continuePlaying() {
    cashOutContainer.style.display ="none";
    gameBoardContainer.style.display ="block";
}
continuePlayingButton.addEventListener('click',continuePlaying)

function addChips(){
cashOutContainer.style.display ="none";
startScreenContainer.style.display ="block";
cashedOutChips.textContent = `Chips remaining: ${yourChips.textContent}`
amountDepositedText.insertAdjacentElement('afterend',cashedOutChips)
resetDepositButton.remove()
startScreenHeader.textContent ="How many chips would you like to add?"
startScreenText.textContent =""
if(amountDepositedText){
    playerDeposit.removeChild(amountDepositedText)
    startButton.textContent = "Deposit and Continue"
}


}
addChipsButton.addEventListener('click',addChips)







function checkPlayerDealerBust() {
    if (playerSum > 21) {
        saveDealerHandValue();
        renderCardsInContainer(dealerHand, dealerHandContainer);
        displayWinLose();
    }
}

 function gameOverScreen() {
    gameBoardContainer.style.display = "none"
    gameOverContainer.style.display = "block"

 }

 function gameOver() {
    gameOverContainer.style.display ="none";
    startScreenContainer.style.display = "block";
    amountDeposited.textContent = 0

 }

 startOverButton.addEventListener('click',gameOver)


 