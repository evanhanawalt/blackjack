/**
 * Game data model
 */
let gameStarted = false,
	gameOver = false,
	playerWon = false,
	deck = [],
	playerScore = 0,
	dealerScore = 0,
	playerHand = [],
	dealerHand = [];

/**
 * Model initiator
 * Add all cards to the deck
 */
function createDeck() {
	let names = ['King', 'Queen', 'Jack', "10", "9", "8", "7", "6", "5", "4", "3", "2", 'Ace']
	let values = [10, 10, 10, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
	let suits = ["Hearts", "Clubs", "Diamonds", "Spades"]

	for (let i = 0; i < suits.length; i++) {
		for (let j = 0; j < values.length; j++) {
			deck.push({
				"suit": suits[i],
				"value": values[j],
				"string": names[j] + ' of ' + suits[i]
			});

			// console.log( names[j] + ' of ' + suits[i])
			// console.log("  s " + suits[i])
			// console.log("  v " +values[j] )
		}
	}
}


/**
 * View elements
 */
let startGameButton = document.getElementById('start-game-button');
let hitButton = document.getElementById('hit-button');
let stayButton = document.getElementById('stay-button');
let textArea = document.getElementById('text-area');
hitButton.style.display = "none"
stayButton.style.display = "none"
/**
 * Set on click listeners
 */
hitButton.addEventListener("click", function () {
	takeHit()
	checkForEndOfGame()
	showGame()
});
stayButton.addEventListener("click", function () {
	endPlayerTurn()
	showGame()
});

startGameButton.addEventListener("click", function () {
	startGame()
	checkForEndOfGame()
	showGame()
});



/**
 * View Setter
 */
function showGame() {

	updateScores()
	let playerHandString = ""
	for (var i = playerHand.length - 1; i >= 0; i--) {
		playerHandString += playerHand[i].string + "\n"
	};
	let dealerHandString = ""
	for (var i = dealerHand.length - 1; i >= 0; i--) {
		dealerHandString += dealerHand[i].string + "\n"
	};

	textArea.innerText = "player: \n" +
		playerHandString +
		 "Score: "  + playerScore + "\n"+
		"\ndealer: \n" +
		dealerHandString +
		"Score: "  + dealerScore+ "\n";



	if(gameOver){
		let winner = 'Dealer'
		if (playerWon){
			winner = 'Player'
		}
		textArea.innerText = textArea.innerText  +  "\n" + winner + ' wins!'
	}

	// show/hide 'start game' and 'hit'/'stay' buttons
	if (gameStarted) {
		startGameButton.style.display = 'none'
		if (!gameOver) {
			hitButton.style.display = 'inline'
			stayButton.style.display = 'inline'
		} else {
			hitButton.style.display = 'none'
			stayButton.style.display = 'none'
		}
	}
}


// Controller code


/**
 * "Randomize" card order
 */
function shuffleDeck() {
	for (let i = 0; i < deck.length; i++) {
		//console.log(deck[i])
		let swapId = Math.trunc(Math.random() * deck.length);
		let tmp = deck[swapId];
		deck[swapId] = deck[i];
		deck[i] = tmp;
	}
}

/**
 * Creates deck, shuffles, and deals cards
 */
function startGame() {
	gameStarted = true;
	createDeck()
	shuffleDeck()
	for (var i = 0; i < 7; i++) {
		shuffleDeck()
	};
	playerHand = []
	dealerHand = []
	playerHand.push(deck.pop())
	dealerHand.push(deck.pop())
	playerHand.push(deck.pop())
	dealerHand.push(deck.pop())
	console.log("game data initialized")

}



/**
 * Sets value of playerScore and dealerScore variables
 */
function updateScores() {
	dealerScore = 0
	let dealerHasAce = false
	dealerHand.forEach(function(element) {
		dealerScore = dealerScore + element.value
		if (element.value == 1) {
			dealerHasAce = true
		}
		//console.log(element.value)
	})


	playerScore = 0
	let playerHasAce = false
	playerHand.forEach(function(element) {
		playerScore = playerScore + element.value
		if (element.value == 1 ) {
			playerHasAce = true
		}
	//	console.log(element.value)
	})



	if (playerHasAce && (playerScore + 10 <= 21) ){
		playerScore = playerScore + 10
	}
	if (dealerHasAce && (dealerScore + 10 <= 21) ){
		dealerScore = dealerScore + 10
	}

	//console.log("scores" + playerScore + '   ' + dealerScore)
}

/**
 * Puts next card from deck into player hand
 */
function takeHit() {
	playerHand.push(deck.pop())
}

/**
 * Allows dealer to draw cards 0 or more cards until the dealer wins or busts
 */
function endPlayerTurn() {
	updateScores()
	checkForEndOfGame()
	// dealer draws until they beat the player, or the player beats them
	while( !gameOver && (dealerScore < playerScore) ) {
		dealerHand.push(deck.pop())
		updateScores()
		checkForEndOfGame()
	}

	if (!gameOver && (dealerScore  >=  playerScore) ){
		gameOver = true
		playerWon = false
	}
	
}

/**
 * Checks blackjacks and busts (instant game over) and sets winner in each case
 */ 
function checkForEndOfGame() {
	updateScores()
	let playerBust =  playerScore > 21
	let dealerBust = dealerScore > 21
	if (playerBust){
		console.log("// game over1")
		gameOver = true
		playerWon = false
	}
	if (dealerBust) {
		console.log("// game over2")
		gameOver = true
		playerWon = true
	}
	if (playerScore == 21) {
		console.log("// game over3")
		gameOver = true
		playerWon = true
	}
	if (dealerScore == 21) {
		console.log("// game over4")
		gameOver = true
		playerWon = false
	}


}








