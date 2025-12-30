import { Player, ComputerPlayer } from "./player.js";

export default class GameManager {
	#boardSize;
	#numShips;
	#maxMissed;
	#isGameOver;
	#isComputerGame;
	constructor(boardSize, numShips, maxMissed, isComputerGame) {
		this.#boardSize = boardSize;
		this.#numShips = numShips;
		this.player = null;
		this.secondPlayer = null;
		this.#maxMissed = maxMissed;
		this.isPlayerTurn = false;
		this.#isGameOver = false;
		this.#isComputerGame = isComputerGame;
		this.isPlayerAddTurn = true;
	}

	getPlayerSquare(x, y) {
		return this.player.gameBoard.getSquare(x, y);
	}

	getSecondPlayerSquare(x, y) {
		return this.secondPlayer.gameBoard.getSquare(x, y);
	}

	getComputerSquare(x, y) {
		return this.secondPlayer.gameBoard.getSquare(x, y);
	}

	initializePlayers(playerName, secondPlayerName) {
		this.initializePlayer(playerName);
		if (this.#isComputerGame) {
			this.initializeComputerPlayer();
			this.initializeComputerShips();
		} else {
			this.initializeSecondPlayer(secondPlayerName);
		}
	}

	initializePlayer(playerName) {
		this.player = new Player(playerName, this.#boardSize);
	}

	initializeSecondPlayer(playerName) {
		this.secondPlayer = new Player(playerName, this.#boardSize);
	}

	initializeComputerPlayer() {
		this.secondPlayer = new ComputerPlayer(this.#boardSize);
	}

	initializeComputerShips() {
		this.secondPlayer.gameBoard.resetBoard();
		this.secondPlayer.gameBoard.randomizeShips(this.#numShips);
	}

	placePlayerShip(shipSize, orientation, x, y) {
		if (this.#numShips - this.playerShipsNum > 0) {
			return this.player.gameBoard.placeShip(shipSize, orientation, x, y);
		}
	}

	placeSecondPlayerShip(shipSize, orientation, x, y) {
		if (this.#numShips - this.secondPlayerShipsNum > 0) {
			return this.secondPlayer.gameBoard.placeShip(shipSize, orientation, x, y);
		}
	}

	makePlayerMove(x, y) {
		const att = this.player.attack(this.secondPlayer, x, y);
		if (
			this.#checkGameOver(this.secondPlayer) ||
			this.playerMissedAttacks >= this.#maxMissed
		) {
			this.#isGameOver = true;
		}
		return att;
	}

	makeSecondPlayerMove(x, y) {
		const att = this.secondPlayer.attack(this.player, x, y);
		if (
			this.#checkGameOver(this.player) ||
			this.secondPlayerMissedAttacks >= this.#maxMissed
		) {
			this.#isGameOver = true;
		}
		return att;
	}

	getPlayerSquareState(x, y) {
		return this.secondPlayer.attacks[y][x];
	}

	getSecondPlayerSquareState(x, y) {
		return this.player.attacks[y][x];
	}

	resetPlayerBoard() {
		if (this.isPlayerAddTurn) {
			this.player.resetBoard();
		} else {
			this.resetSecondPlayerBoard();
		}
	}

	resetSecondPlayerBoard() {
		this.secondPlayer.resetBoard();
	}

	resetGame() {
		this.resetPlayerBoard();
		this.resetSecondPlayerBoard();
		this.#isGameOver = false;
		this.isPlayerTurn = false;
		this.isPlayerAddTurn = true;
	}

	randomizePlayerShips() {
		if (this.isPlayerAddTurn) {
			this.player.gameBoard.randomizeShips(this.#numShips);
		} else {
			this.secondPlayer.gameBoard.randomizeShips(this.#numShips);
		}
	}

	#checkGameOver(player) {
		return player.gameBoard.isGameOver;
	}

	makeComputerMove() {
		const att = this.secondPlayer.attack(this.player);
		if (
			this.#checkGameOver(this.secondPlayer) ||
			this.secondPlayerMissedAttacks >= this.#maxMissed
		) {
			this.#isGameOver = true;
		}
		return att;
	}

	determineWinner() {
		if (this.playerScore > this.secondPlayerScore) {
			return this.player;
		} else if (this.secondPlayerScore > this.playerScore) {
			return this.secondPlayer;
		} else {
			return null;
		}
	}

	get playerShipsNum() {
		return this.player.gameBoard.ships.length;
	}

	get secondPlayerShipsNum() {
		return this.secondPlayer.gameBoard.ships.length;
	}

	get numShips() {
		return this.#numShips;
	}

	get boardSize() {
		return this.#boardSize;
	}

	get maxMissed() {
		return this.#maxMissed;
	}

	get playerName() {
		return this.player.name;
	}

	get secondPlayerName() {
		return this.secondPlayer.name;
	}

	get isComputerGame() {
		return this.#isComputerGame;
	}

	get playerMissedAttacks() {
		return this.player.missedAttacks;
	}

	get secondPlayerMissedAttacks() {
		return this.secondPlayer.missedAttacks;
	}

	get playerDestroyedShips() {
		return this.player.shipsDestroyed;
	}

	get secondPlayerDestroyedShips() {
		return this.secondPlayer.shipsDestroyed;
	}

	get playerScore() {
		return this.player.score;
	}

	get secondPlayerScore() {
		return this.secondPlayer.score;
	}

	get isGameOver() {
		return this.#isGameOver;
	}
}
